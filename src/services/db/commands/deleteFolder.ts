"use server";
import { s3Client } from "@/services/aws/s3";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { FileModel, FolderModel, IFile, IFolder } from "../models";
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
            const deleteFilesFromS3 = async (folder: IFolder) => {
                const objectIdentifiers = folder.files.map((file: IFile) => ({
                    Key: file.s3Key,
                }));

                const deleteParams = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Delete: {
                        Objects: objectIdentifiers,
                        Quiet: false,
                    },
                };

                await s3Client.send(new DeleteObjectsCommand(deleteParams));
            };

            // Recursive function to delete folder and its children
            const deleteFolderRecursively = async (id: string) => {
                const folder = await FolderModel.findById(id)
                    .session(sess)
                    .exec();
                if (!folder) {
                    throw new Error(`Folder with ID ${id} not found.`);
                }

                // Delete files from S3
                await deleteFilesFromS3(folder);

                // Delete child files
                await FileModel.deleteMany({ folderId: id })
                    .session(sess)
                    .exec();

                // Delete child folders recursively
                const childFolders = await FolderModel.find({ parent: id })
                    .session(sess)
                    .exec();
                for (const childFolder of childFolders) {
                    await deleteFolderRecursively(childFolder._id);
                }

                // Finally, delete the folder itself
                await FolderModel.findByIdAndDelete(id).session(sess).exec();
            };

            await deleteFolderRecursively(folderId);

            // Commit the transaction
            await sess.commitTransaction();
            revalidatePath(`/folder/${folderId}`);
        },
        { maxCommitTimeMS: 10000, retryWrites: true }
    );
}
