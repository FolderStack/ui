"use server";
import { toObjectId } from "@/services/db/utils/toObjectId";
import mongoose from "mongoose";
import { FolderModel, IFile } from "../models";
import { mongoConnect } from "../mongodb";
import { isValidId } from "../utils/isValidID";

export async function updateFile(
    fileId: string,
    data: Partial<IFile>
): Promise<any> {
    if (!isValidId(fileId)) {
        throw new Error("Invalid file ID.");
    }

    await mongoConnect();

    const session = await mongoose.startSession();
    await session.withTransaction(
        async (sess) => {
            // Find the folder containing the file to update
            const oldFolder = await FolderModel.findOne(
                { "files._id": fileId },
                { "files.$": 1 }
            )
                .session(sess)
                .exec();

            if (
                !oldFolder ||
                !oldFolder.files ||
                oldFolder.files.length === 0
            ) {
                throw new Error("File not found.");
            }

            const oldFileData = oldFolder.files[0];

            // Update file in the old folder
            await FolderModel.updateOne(
                { _id: oldFolder._id, "files._id": fileId },
                { $set: { "files.$": data } },
                { session: sess }
            ).exec();

            // Update files array for old and new parent folders if folderId has changed
            if (
                data.folderId &&
                String(data.folderId) !== String(oldFileData.folderId)
            ) {
                // Remove from old parent folder
                await FolderModel.updateOne(
                    { _id: oldFolder._id },
                    { $pull: { files: { _id: fileId } } },
                    { session: sess }
                ).exec();

                // Add to new parent folder
                await FolderModel.updateOne(
                    { _id: toObjectId(data.folderId) },
                    { $push: { files: { _id: fileId, ...data } } },
                    { session: sess }
                ).exec();
            }

            await sess.commitTransaction();
        },
        { maxCommitTimeMS: 10000, retryWrites: true }
    );
}
