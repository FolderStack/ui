"use server";
import { s3Client } from "@/services/aws/s3";
import { toObjectId } from "@/services/db/utils/toObjectId";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { FolderModel } from "../models";
import { mongoConnect } from "../mongodb";
import { findOrCreateRootFolder } from "../queries/findOrCreateRootFolder";
import { isValidId } from "../utils/isValidID";

export async function deleteFile(
    fileId: string,
    folderId: string,
    orgId: string
): Promise<any> {
    if (!isValidId(fileId)) {
        throw new Error("Invalid file ID");
    }

    const isRoot = folderId === "@root";

    if (!isRoot && !isValidId(folderId)) {
        throw new Error("Invalid parent ID");
    }

    const id = toObjectId(fileId);
    let parent = isRoot ? folderId : toObjectId(folderId);

    await mongoConnect();

    const session = await mongoose.startSession();
    await session.withTransaction(
        async (sess) => {
            // Fetch the parent folder to get the file's S3 key
            let folder;
            if (isRoot) {
                folder = await findOrCreateRootFolder(orgId, session);
                parent = folder._id;
            } else {
                folder = await FolderModel.findById(parent)
                    .session(sess)
                    .exec();
            }

            if (!folder) {
                throw new Error("Folder not found");
            }

            const file = folder.files.find(
                (f: any) => String(f._id) === String(id)
            );
            if (!file) {
                throw new Error("File not found");
            }

            const s3Key = file.s3Key; // Replace with actual field name for S3 key

            // Update the parent folder to remove the file reference
            await FolderModel.findByIdAndUpdate(
                parent,
                {
                    $pull: {
                        files: {
                            _id: id,
                        },
                    },
                },
                { session: sess }
            ).exec();

            if (s3Key && typeof s3Key === "string" && s3Key.length > 0) {
                const deleteObject = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: s3Key,
                };

                await s3Client.send(new DeleteObjectCommand(deleteObject));
            }

            // Commit the transaction
            await sess.commitTransaction();
            revalidatePath(`/folder/${folderId}`);
        },
        { maxCommitTimeMS: 10000, retryWrites: true }
    );
}
