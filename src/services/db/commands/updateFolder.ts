"use server";
import mongoose from "mongoose";
import { FileSystemObjectModel } from "../models";
import { mongoConnect } from "../mongodb";
import { isValidId } from "../utils/isValidID";

export async function updateFolder(
    folderId: string,
    data: Partial<any>
): Promise<any> {
    if (!isValidId(folderId)) {
        throw new Error("Invalid folder ID.");
    }

    await mongoConnect();

    const session = await mongoose.startSession();
    await session.withTransaction(
        async (sess) => {
            // Find the folder to update
            const folderToUpdate = await FileSystemObjectModel.findById(
                folderId
            )
                .session(sess)
                .exec();

            if (!folderToUpdate || folderToUpdate.type !== "folder") {
                throw new Error("Folder not found.");
            }

            // Update folder data
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    (folderToUpdate as any)[key] = data[key];
                }
            }
            await folderToUpdate.save({ session: sess });

            // If the parent folder has changed, update the old and new parents
            if (
                data.parent &&
                String(data.parent) !== String(folderToUpdate.parent)
            ) {
                // Remove from old parent folder
                await FileSystemObjectModel.findByIdAndUpdate(
                    folderToUpdate.parent,
                    {
                        $pull: { children: folderId },
                    }
                )
                    .session(sess)
                    .exec();

                // Add to new parent folder
                await FileSystemObjectModel.findByIdAndUpdate(data.parent, {
                    $push: { children: folderId },
                })
                    .session(sess)
                    .exec();

                // Update the folder's parent
                folderToUpdate.parent = data.parent;
                await folderToUpdate.save({ session: sess });
            }

            await sess.commitTransaction();
        },
        { maxCommitTimeMS: 10000, retryWrites: true }
    );
}
