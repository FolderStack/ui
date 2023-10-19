"use server";
import mongoose from "mongoose";
import { FileSystemObjectModel, IFileSystemObject } from "../models";
import { mongoConnect } from "../mongodb";
import { findOrCreateRootFolder } from "../queries/findOrCreateRootFolder";

export async function createFolder(
    orgId: string,
    data: Partial<IFileSystemObject>
) {
    if (!data || !data.name || !data.orgId) {
        throw new Error("Missing required fields for folder creation.");
    }

    await mongoConnect();

    const session = await mongoose.startSession();
    return session.withTransaction(async (sess) => {
        // Delete the parent field if it's not a valid string
        if (!(typeof data.parent === "string" && data.parent.length > 0)) {
            data.parent = "@root";
        }

        // Set the type to 'folder'
        const newFolderData = {
            ...data,
            type: "folder",
            orgId,
        };

        let parentFolder;
        if (data.parent === "@root") {
            parentFolder = await findOrCreateRootFolder(orgId, sess);
        } else {
            parentFolder = await FileSystemObjectModel.findById(
                data.parent
            ).session(sess);
        }

        if (!parentFolder) {
            throw new Error("Parent folder not found");
        }

        if (!parentFolder.children) {
            parentFolder.children = [];
        }

        const newFolder = new FileSystemObjectModel(newFolderData);
        if (data.parent !== "@root") {
            newFolder.parent = parentFolder.id;
        } else {
            newFolder.parent = null;
        }

        const savedFolder = await newFolder.save({ session: sess });

        parentFolder.children.push(String(savedFolder._id));
        parentFolder.updatedAt = new Date();
        await parentFolder.save({ session: sess });

        await sess.commitTransaction();

        return parentFolder;
    });
}
