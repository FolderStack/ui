import mongoose from "mongoose";
import { FolderModel, IFolder } from "../models/folder";
import { mongoConnect } from "../mongodb";

export async function createFolder(data: Partial<IFolder>) {
    if (!data || !data.name || !data.orgId) {
        throw new Error("Missing required fields for folder creation.");
    }

    await mongoConnect();

    const session = await mongoose.startSession();
    await session.withTransaction(async (sess) => {
        // Create the new folder
        const newFolder = new FolderModel(data);
        const savedFolder = await newFolder.save({ session: sess });

        if (data.parent) {
            const parentFolder = await FolderModel.findById(
                data.parent
            ).session(sess);
            if (!parentFolder) {
                throw new Error("Parent folder not found");
            }

            parentFolder.children.push(savedFolder._id);
            parentFolder.updatedAt = new Date();
            await parentFolder.save({ session: sess });
        }

        await sess.commitTransaction();
    });
}
