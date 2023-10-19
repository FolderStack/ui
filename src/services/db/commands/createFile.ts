"use server";
import mongoose from "mongoose";
import { FileSystemObjectModel, IFileSystemObject } from "../models";
import { mongoConnect } from "../mongodb";
import { findOrCreateRootFolder } from "../queries/findOrCreateRootFolder";
import { isValidId } from "../utils/isValidID";

export const createFile = async (
    folderId: string,
    orgId: string,
    data: Partial<IFileSystemObject>
): Promise<any> => {
    if (!data || !data.name || !folderId) {
        throw new Error("Missing required fields for file creation.");
    }

    if (folderId !== "@root" && !isValidId(folderId)) {
        throw new Error("Invalid folder ID.");
    }

    await mongoConnect();

    const session = await mongoose.startSession();
    await session.withTransaction(
        async (session) => {
            // Create the new file
            const newFileData = {
                ...data,
                type: "file", // Define the type as 'file'
                orgId,
            };

            const newFile = new FileSystemObjectModel(newFileData); // Use the unified model

            // Update the folder
            let folder;
            if (folderId === "@root") {
                folder = await findOrCreateRootFolder(orgId, session);
            } else {
                newFile.parent = folderId;
                folder = await FileSystemObjectModel.findById(folderId).session(
                    session
                );
            }

            if (!folder) {
                throw new Error("Folder not found");
            }

            if (!folder.children) {
                folder.children = [];
            }

            folder.children.push(String(newFile._id));
            folder.updatedAt = new Date();

            await newFile.save({ session });
            await folder.save({ session });

            await session.commitTransaction();
        },
        { maxCommitTimeMS: 10000, retryWrites: true }
    );
};
