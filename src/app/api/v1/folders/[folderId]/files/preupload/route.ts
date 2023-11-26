import { authOptions } from "@/services/auth";
import { s3Client } from "@/services/aws/s3";
import { PageParamProps } from "@/types/params";
import { getRequestBody } from "@/utils/getRequestBody";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import md5 from "md5";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, { params }: PageParamProps) => {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const orgId = session?.user?.orgId;

    if (!orgId || !userId) {
        return new NextResponse(
            JSON.stringify({ success: false, message: "Unauthorized" }),
            { status: 401 }
        );
    }

    let { folderId } = params;
    if (folderId instanceof Array) {
        folderId = folderId[0] ?? null;
    }

    if (!folderId) {
        return new NextResponse(
            JSON.stringify({
                success: false,
                message: "No folder ID provided",
            }),
            { status: 400 }
        );
    }

    try {
        const data = await getRequestBody(req);
        const { files = [] } = data ?? {};

        if (!data || !files.length) {
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    message: "No files to upload",
                }),
                { status: 400 }
            );
        }

        const urlPromises = await Promise.allSettled(
            files.map(async (file: any) => {
                const name = file.name;

                let prefix = process.env.AWS_BUCKET_PREFIX;
                prefix = prefix?.length ? prefix + "/" : "";
                const key = `${prefix}assets/${orgId}/${Date.now()}/${md5(
                    name
                )}`;

                const url = await getSignedUrl(
                    s3Client as any,
                    new PutObjectCommand({
                        Bucket: process.env.AWS_BUCKET_NAME!,
                        Key: key,
                    }) as any,
                    {
                        expiresIn: 600,
                    }
                );

                return { id: file.id, url };
            })
        );

        const result = urlPromises.reduce((acc, result) => {
            if (result.status === "fulfilled") {
                if ("id" in result.value) {
                    if ("url" in result.value) {
                        acc[result.value.id] = { url: result.value.url };
                    } else {
                        acc[result.value.id] = { error: "Failed to get url" };
                    }
                }
            }

            return acc;
        }, {} as Record<string, { url: string } | { error: string }>);

        return new NextResponse(JSON.stringify({ files: result }), {
            status: 200,
        });
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
};
