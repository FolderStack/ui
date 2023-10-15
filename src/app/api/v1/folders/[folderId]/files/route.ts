import { authOptions } from "@/services/auth";
import { s3Client } from "@/services/aws/s3";
import { createFile } from "@/services/db/commands/createFile";
import { PageParamProps } from "@/types/params";
import { PutObjectCommand } from "@aws-sdk/client-s3";
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
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    message: "No file uploaded",
                }),
                { status: 400 }
            );
        }

        const name = file.name;
        const buffer = await file.arrayBuffer();
        const mimeType = file.type ?? "application/octetstream";
        const fileSize = file.size;

        const putObject = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `assets/${orgId}/${folderId}/${md5(name)}`,
            Body: Buffer.from(buffer),
            ContentType: mimeType,
        };

        const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${putObject.Key}`;

        await s3Client.send(new PutObjectCommand(putObject));

        await createFile(folderId, {
            name,
            fileSize,
            mimeType,
            s3Key: putObject.Key,
            s3Url,
            createdBy: userId,
        });

        return new NextResponse(JSON.stringify({ success: true }), {
            status: 201,
        });
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500 }
        );
    }
};
