import mongoose from "mongoose";
import { FolderModel, IFolder } from "../models/folder";
import { mongoConnect } from "../mongodb";
import { isValidId } from "../utils/isValidID";

export async function updateFolder(
    folderId: string,
    data: Partial<IFolder>
): Promise<any> {
    if (!isValidId(folderId)) {
        throw new Error("Invalid folder ID.");
    }

    await mongoConnect();

    const session = await mongoose.startSession();
    await session.withTransaction(
        async (sess) => {
            const oldFolderData = await FolderModel.findById(folderId)
                .session(sess)
                .exec();

            if (!oldFolderData) {
                throw new Error("Folder not found.");
            }

            await FolderModel.findByIdAndUpdate(folderId, data, {
                new: true,
                session: sess,
            }).exec();

            // Update children array for old and new parent folders
            if (
                data.parent &&
                String(data.parent) !== String(oldFolderData.parent)
            ) {
                if (oldFolderData.parent) {
                    await FolderModel.findByIdAndUpdate(
                        oldFolderData.parent,
                        { $pull: { children: folderId } },
                        { session: sess }
                    ).exec();
                }

                await FolderModel.findByIdAndUpdate(
                    data.parent,
                    { $push: { children: folderId } },
                    { session: sess }
                ).exec();
            }

            await sess.commitTransaction();
        },
        { maxCommitTimeMS: 10000, retryWrites: true }
    );
}
