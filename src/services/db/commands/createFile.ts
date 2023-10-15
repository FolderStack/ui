import mongoose from "mongoose";
import { FileModel, FolderModel, IFile } from "../models";
import { mongoConnect } from "../mongodb";
import { isValidId } from "../utils/isValidID";

export const createFile = async (
    folderId: string,
    data: Partial<IFile>
): Promise<any> => {
    if (!data || !data.name || !folderId) {
        throw new Error("Missing required fields for file creation.");
    }

    if (!isValidId(folderId)) {
        throw new Error("Invalid folder ID.");
    }

    await mongoConnect();

    const session = await mongoose.startSession();
    await session.withTransaction(
        async (session) => {
            // Create the new file
            const newFile = new FileModel(data);

            // Update the folder
            const folder = await FolderModel.findById(folderId).session(
                session
            );
            if (!folder) {
                throw new Error("Folder not found");
            }

            folder.files.push(newFile); // Add the new file to the folder's files
            folder.updatedAt = new Date(); // Update the lastUpdated date

            await folder.save({ session });
            await session.commitTransaction();
        },
        { maxCommitTimeMS: 10000, retryWrites: true }
    );
};
