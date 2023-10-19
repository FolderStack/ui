"use server";
import mongoose from "mongoose";
import { FileSystemObjectModel } from "../models";
import { mongoConnect } from "../mongodb";
import { isValidId } from "../utils/isValidID";

export async function updateFile(
    fileId: string,
    data: Partial<any>
): Promise<any> {
    if (!isValidId(fileId)) {
        throw new Error("Invalid file ID.");
    }

    await mongoConnect();

    const session = await mongoose.startSession();
    await session.withTransaction(
        async (sess) => {
            // Find the folder or file to update
            const fileToUpdate = await FileSystemObjectModel.findById(fileId)
                .session(sess)
                .exec();

            if (!fileToUpdate || fileToUpdate.type !== "file") {
                throw new Error("File not found.");
            }

            // Update file data
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    (fileToUpdate as any)[key] = data[key];
                }
            }
            await fileToUpdate.save({ session: sess });

            // If the parent folder has changed, update the old and new parents
            if (
                data.parent &&
                String(data.parent) !== String(fileToUpdate.parent)
            ) {
                // Remove from old parent folder
                await FileSystemObjectModel.findByIdAndUpdate(
                    fileToUpdate.parent,
                    {
                        $pull: { children: fileId },
                    }
                )
                    .session(sess)
                    .exec();

                // Add to new parent folder
                await FileSystemObjectModel.findByIdAndUpdate(data.parent, {
                    $push: { children: fileId },
                })
                    .session(sess)
                    .exec();

                // Update the file's parent
                fileToUpdate.parent = data.parent;
                await fileToUpdate.save({ session: sess });
            }

            await sess.commitTransaction();
        },
        { maxCommitTimeMS: 10000, retryWrites: true }
    );
}
