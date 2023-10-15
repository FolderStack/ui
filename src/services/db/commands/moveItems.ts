"use server";
import mongoose from "mongoose";
import { FolderModel } from "../models/folder";
import { mongoConnect } from "../mongodb";
import { isValidId } from "../utils/isValidID";

export async function moveItems(
    itemIds: string[],
    targetId: string
): Promise<any> {
    if (!isValidId(targetId) || itemIds.some((id) => !isValidId(id))) {
        throw new Error("Invalid ID(s).");
    }

    await mongoConnect();

    const session = await mongoose.startSession();
    await session.withTransaction(
        async (sess) => {
            // Validate target folder
            const targetFolder = await FolderModel.findById(targetId)
                .session(sess)
                .exec();
            if (!targetFolder) {
                throw new Error("Target folder not found.");
            }

            for (const itemId of itemIds) {
                const folder = await FolderModel.findById(itemId)
                    .session(sess)
                    .exec();

                if (folder) {
                    // It's a folder
                    // Remove from old parent
                    if (folder.parent) {
                        await FolderModel.findByIdAndUpdate(folder.parent, {
                            $pull: { children: itemId },
                        })
                            .session(sess)
                            .exec();
                    }

                    // Add to new parent
                    await FolderModel.findByIdAndUpdate(targetId, {
                        $push: { children: itemId },
                    })
                        .session(sess)
                        .exec();

                    // Update the folder itself
                    await FolderModel.findByIdAndUpdate(itemId, {
                        parent: targetId,
                    })
                        .session(sess)
                        .exec();
                } else {
                    // It's a file
                    // Find the parent folder of this file
                    const parentFolder = await FolderModel.findOne({
                        files: { $elemMatch: { _id: itemId } },
                    })
                        .session(sess)
                        .exec();

                    if (parentFolder) {
                        // Remove file from old folder
                        await FolderModel.findByIdAndUpdate(parentFolder._id, {
                            $pull: { files: { _id: itemId } },
                        })
                            .session(sess)
                            .exec();

                        // Add file to new folder
                        await FolderModel.findByIdAndUpdate(
                            targetId,
                            { $push: { files: { _id: itemId } } } // Adjust this based on your actual file schema
                        )
                            .session(sess)
                            .exec();
                    } else {
                        throw new Error(`File with ID ${itemId} not found.`);
                    }
                }
            }

            await sess.commitTransaction();
        },
        { maxCommitTimeMS: 10000, retryWrites: true }
    );
}
