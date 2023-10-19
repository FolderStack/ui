"use server";

import { s3Client } from "@/services/aws/s3";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { FileSystemObjectModel, IFileSystemObject } from "../models";
import { mongoConnect } from "../mongodb";
import { isValidId } from "../utils/isValidID";

export async function deleteFolder(folderId: string): Promise<any> {
    if (!isValidId(folderId)) {
        throw new Error("Invalid folder ID.");
    }

    await mongoConnect();

    const session = await mongoose.startSession();
    await session.withTransaction(
        async (sess) => {
            const deleteFilesFromS3 = async (folder: IFileSystemObject) => {
                if (!folder.children || !folder.children.length) return;

                // Fetch children details
                const childObjects = await FileSystemObjectModel.find({
                    _id: { $in: folder.children },
                })
                    .session(sess)
                    .exec();

                // Filter out files and form the S3 delete params
                const objectIdentifiers = childObjects
                    .filter((child) => child.type === "file")
                    .map((file) => ({ Key: file.s3Key }));

                if (objectIdentifiers.length > 0) {
                    const deleteParams = {
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Delete: {
                            Objects: objectIdentifiers,
                            Quiet: false,
                        },
                    };

                    await s3Client.send(new DeleteObjectsCommand(deleteParams));
                }
            };

            // Recursive function to delete folder and its children
            const deleteFolderRecursively = async (
                id: string | mongoose.Types.ObjectId
            ) => {
                const folder = await FileSystemObjectModel.findById(id)
                    .session(sess)
                    .exec();
                if (!folder) {
                    throw new Error(`Folder with ID ${id} not found.`);
                }

                // Delete files from S3
                await deleteFilesFromS3(folder);

                // Delete child objects
                await FileSystemObjectModel.deleteMany({ parent: id })
                    .session(sess)
                    .exec();

                // Delete child folders recursively
                const childFolders = await FileSystemObjectModel.find({
                    parent: id,
                    type: "folder",
                })
                    .session(sess)
                    .exec();
                for (const childFolder of childFolders) {
                    await deleteFolderRecursively(childFolder._id);
                }

                // Finally, delete the folder itself
                await FileSystemObjectModel.findByIdAndDelete(id)
                    .session(sess)
                    .exec();
            };

            await deleteFolderRecursively(folderId);

            // Commit the transaction
            await sess.commitTransaction();
            revalidatePath(`/folder/${folderId}`);
        },
        { maxCommitTimeMS: 10000, retryWrites: true }
    );
}
