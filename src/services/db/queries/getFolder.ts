"use server";
import { removeObjectIds } from "@/services/db/utils/removeObjectIds";
import { toObjectId } from "@/services/db/utils/toObjectId";
import { FileSystemObjectModel } from "../models"; // Import the new model
import { mongoConnect } from "../mongodb";
import { isValidId } from "../utils/isValidID";

export async function getFolder(id: string | null) {
    const folderId = isValidId(id ?? "") ? toObjectId(id) : null;

    if (folderId === null) {
        return {
            id: null,
            name: "Home",
            type: "folder", // Specify type as "folder"
            parent: null,
            createdBy: "system",
            createdAt: new Date(0).toISOString(),
            updatedAt: null,
        };
    }

    const pipeline = [
        { $match: { _id: folderId, type: "folder" } }, // Specify type as "folder"
        {
            $project: {
                name: 1,
                type: 1, // Include type in projection
                parent: 1,
                orgId: 1, // changed from organizationId to match new schema
                createdBy: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ];

    await mongoConnect();
    const [folderInfo] = await FileSystemObjectModel.aggregate(pipeline).exec(); // Use the new model

    if (folderInfo) {
        return removeObjectIds(folderInfo);
    }

    return null;
}
