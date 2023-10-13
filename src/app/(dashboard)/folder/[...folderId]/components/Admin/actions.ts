"use server";

import { authOptions } from "@/services/auth";
import { s3Client } from "@/services/aws/s3";
import { createFolder } from "@/services/db/commands/createFolder";
import { FileModel } from "@/services/db/models";
import { mongoConnect } from "@/services/db/mongodb";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import md5 from "md5";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function createFolderAction(_: any, form: FormData) {
    const name = form.get("name");
    const parent = form.get("parent");

    if (typeof name !== "string") {
        return { success: false, message: "Invalid name" };
    }

    if (parent && typeof parent !== "string") {
        return { success: false, message: "Invalid parent folder" };
    }

    const session = await getServerSession(authOptions);
    const orgId = session?.user?.orgId;
    const userId = session?.user?.id;

    if (!orgId || !userId) {
        redirect("/api/auth/signin");
    }

    try {
        await createFolder({
            name,
            orgId,
            createdBy: userId,
            parent: parent ?? undefined,
        });

        revalidateTag(parent ?? "root");

        return { success: true, message: "Created folder" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function uploadFilesAction(_: any, fn: Function, form: FormData) {
    fn();
    const folderId = form.get("folderId");

    if (folderId && typeof folderId !== "string") {
        return { success: false, message: "Invalid folder" };
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const orgId = session?.user?.orgId;

    if (!orgId || !userId) {
        redirect("/api/auth/signin");
    }

    const files = Array.from(form.entries())
        .filter(([key]) => key.startsWith("file"))
        .map(([_, value]) => value);

    await mongoConnect();
    const savedFiles = [];
    for (const file of files as File[]) {
        const name = file.name;
        const buffer = await file.arrayBuffer();
        const mimeType = file.type ?? 'application/octetstream';
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

    return { success: true };
}
