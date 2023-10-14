import { authOptions } from "@/services/auth";
import { s3Client } from "@/services/aws/s3";
import { FileModel } from "@/services/db/models";
import { mongoConnect } from "@/services/db/mongodb";
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

    const { folderId } = params;
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
        const files = Array.from(formData.entries())
            .filter(([key]) => key.startsWith("file"))
            .map(([_, value]) => value) as File[];

        if (!files || files.length === 0) {
            return new NextResponse(
                JSON.stringify({
                    success: false,
                    message: "No files uploaded",
                }),
                { status: 400 }
            );
        }

        const savedFiles = [];
        await mongoConnect();
        for (const file of files) {
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

            const newFile = new FileModel({
                name,
                fileSize,
                mimeType,
                folderId,
                s3Key: putObject.Key,
                s3Url,
                createdBy: userId,
            });

            const savedFile = await newFile.save();
            savedFiles.push(savedFile);
        }

        return new NextResponse(
            JSON.stringify({ success: true, files: savedFiles }),
            { status: 201 }
        );
    } catch (error: any) {
        return new NextResponse(
            JSON.stringify({ success: true, message: error.message }),
            { status: 500 }
        );
    }
};
