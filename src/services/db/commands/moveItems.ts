"use server";
import mongoose from "mongoose";
import { FileSystemObjectModel } from "../models";
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
            const targetFolder = await FileSystemObjectModel.findById(targetId)
                .session(sess)
                .exec();
            if (!targetFolder || targetFolder.type !== "folder") {
                throw new Error("Target folder not found.");
            }

            for (const itemId of itemIds) {
                const item = await FileSystemObjectModel.findById(itemId)
                    .session(sess)
                    .exec();

                if (!item) {
                    throw new Error(`Item with ID ${itemId} not found.`);
                }

                // Remove item from the old parent folder's children array
                if (item.parent) {
                    await FileSystemObjectModel.findByIdAndUpdate(item.parent, {
                        $pull: { children: itemId },
                    })
                        .session(sess)
                        .exec();
                }

                // Add item to the new parent folder's children array
                await FileSystemObjectModel.findByIdAndUpdate(targetId, {
                    $push: { children: itemId },
                })
                    .session(sess)
                    .exec();

                // Update the item's parent
                await FileSystemObjectModel.findByIdAndUpdate(itemId, {
                    parent: targetId,
                })
                    .session(sess)
                    .exec();
            }

            await sess.commitTransaction();
        },
        { maxCommitTimeMS: 10000, retryWrites: true }
    );
}
