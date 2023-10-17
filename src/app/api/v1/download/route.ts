import { authOptions } from "@/services/auth";
import { s3Client } from "@/services/aws/s3";
import { getFilesAndFoldersByIds } from "@/services/db/queries/findFilesAndFoldersByIds";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { create as createArchiver } from "archiver";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { PassThrough, Readable } from "stream";

import { ReadableStream } from "web-streams-polyfill/ponyfill";

const nodeStreamToWebStream = (
    nodeStream: NodeJS.ReadableStream
): ReadableStream<Uint8Array> => {
    const reader = nodeStream.pipe(new PassThrough());

    return new ReadableStream<Uint8Array>({
        async pull(controller) {
            for await (const chunk of reader) {
                controller.enqueue(new Uint8Array(chunk));
            }
            controller.close();
        },
    });
};

function webStreamToNodeReadable(webStream: ReadableStream<any>): Readable {
    const reader = webStream.getReader();
    return new Readable({
        async read() {
            const { done, value } = await reader.read();
            if (done) {
                this.push(null);
            } else {
                this.push(Buffer.from(value));
            }
        },
    });
}

export const GET = async (req: NextRequest) => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const orgId = session?.user?.orgId;

    if (!orgId || !userId) {
        return new NextResponse(
            JSON.stringify({ success: false, message: "Unauthorized" }),
            { status: 401 }
        );
    }

    const url = new URL(req.url);
    let { selection = [] as string[] } = Object.fromEntries(url.searchParams);

    if (Array.isArray(selection)) {
        selection = selection.map(String);
    } else if (typeof selection === "string") {
        selection = selection.split(",");
    }

    if (!selection.length) {
        return new NextResponse(
            JSON.stringify({ success: false, message: "Nothing to download" }),
            { status: 400 }
        );
    }

    try {
        const filesAndFolders = await getFilesAndFoldersByIds(selection);

        if (!filesAndFolders.length) {
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    message: "Selection not found",
                }),
                { status: 404 }
            );
        } else if (
            filesAndFolders.length === 1 &&
            filesAndFolders[0].type === "file"
        ) {
            const output = new PassThrough();
            const webStream = nodeStreamToWebStream(output);
            output.on("finish", () => console.debug("PassThrough finished"));
            output.on("error", (err) =>
                console.debug("PassThrough error:", err)
            );

            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: filesAndFolders[0].s3Key,
            };

            const s3Object = await s3Client.send(new GetObjectCommand(params));

            if (s3Object.Body) {
                const s3Stream = s3Object.Body as Readable;
                s3Stream.pipe(output);

                const headers = {
                    "Content-Type":
                        s3Object.ContentType || "application/octet-stream",
                    "Content-Disposition": `attachment; filename=${filesAndFolders[0].name}`,
                };

                return new NextResponse(webStream, { headers });
            } else {
                return new NextResponse(
                    JSON.stringify({
                        success: false,
                        message: "Failed to download file",
                    }),
                    { status: 500 }
                );
            }
        } else {
            const output = new PassThrough();
            const archive = createArchiver("zip");

            const webStream = nodeStreamToWebStream(output);
            archive.pipe(output);
            output.on("finish", () => console.debug("PassThrough finished"));
            output.on("error", (err) =>
                console.debug("PassThrough error:", err)
            );
            archive.on("finish", () => console.debug("Archive finished"));
            archive.on("error", (err) => console.debug("Archive error:", err));

            for (const item of filesAndFolders) {
                if (item.type === "file") {
                    const params = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: item.s3Key,
                    };
                    try {
                        const s3Object = await s3Client.send(
                            new GetObjectCommand(params)
                        );
                        if (s3Object.Body) {
                            archive.append(s3Object.Body as Readable, {
                                name: item.path,
                            });
                        } else {
                            archive.append("failed to download", {
                                name: item.path,
                            });
                        }
                    } catch (awsError) {
                        console.error(`AWS S3 error: ${awsError}`);
                        // handle this error
                    }
                }
                if (item.type === "folder") {
                    archive.append("", { name: item.path });
                }
            }

            archive.finalize();

            const headers = {
                "Content-Type": "application/zip",
                "Content-Disposition": `attachment; filename=download.zip`,
            };

            return new NextResponse(webStream, { headers });
        }
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
};
