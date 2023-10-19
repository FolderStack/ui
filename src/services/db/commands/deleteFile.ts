"use server";
import { s3Client } from "@/services/aws/s3";
import { toObjectId } from "@/services/db/utils/toObjectId";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import mongoose from "mongoose";
import { FileSystemObjectModel } from "../models";
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
            try {
                // Fetch the file object to get the S3 key
                const file = await FileSystemObjectModel.findById(id).session(
                    sess
                );
                if (!file || !file.s3Key) {
                    throw new Error("File not found or missing S3 key");
                }

                await FileSystemObjectModel.deleteOne(id);

                let folder;
                if (isRoot) {
                    folder = await findOrCreateRootFolder(orgId, session);
                    parent = folder._id;
                } else {
                    folder = await FileSystemObjectModel.findById(parent)
                        .session(sess)
                        .exec();
                }

                // Remove from the parent if it's there...
                if (folder && folder.children?.length) {
                    const fileIndex = folder.children.findIndex(
                        (child) => String(child) === String(id)
                    );

                    if (fileIndex !== -1) {
                        // Remove the file reference from the parent folder
                        folder.children.splice(fileIndex, 1);
                        await FileSystemObjectModel.findByIdAndUpdate(parent, {
                            $pull: { children: id },
                        })
                            .session(sess)
                            .exec();
                    }
                }

                // Delete the file from S3 if it has a valid key
                const s3Key = file.s3Key;
                if (s3Key && typeof s3Key === "string" && s3Key.length > 0) {
                    const deleteObject = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: s3Key,
                    };
                    await s3Client.send(new DeleteObjectCommand(deleteObject));
                }

                // Commit the transaction
                await sess.commitTransaction();
            } catch (err) {
                console.log(err);
            }
        },
        { maxCommitTimeMS: 10000, retryWrites: true }
    );
}
