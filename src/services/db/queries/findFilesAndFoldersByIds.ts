import mongoose from "mongoose";
import { FolderModel } from "../models";

function transformResultWithPaths(
    result: any[],
    selection: Set<string>,
    folderMap: Map<string, string> = new Map(),
    seenPaths: Set<string> = new Set(),
    output = [] as any[]
) {
    for (const item of result) {
        const { files: file, ...folder } = item;

        const fileId = String(file.id);
        const folderId = String(folder._id);
        const parentId = folder.parent ? String(folder.parent) : null;

        let folderPath = `${folder.name}/`;

        if (folderMap.has(folderId)) {
            folderPath = folderMap.get(folderId)!;
        } else {
            if (parentId) {
                const parentPath = folderMap.get(parentId);
                if (parentPath) {
                    folderPath = `${parentPath}/${folderPath}`;
                }
            }
        }

        // If a folder is selected but not yet added, add it.
        if (selection.has(folderId)) {
            output.push({
                id: folderId,
                type: "folder",
                name: folder.name,
                path: folderPath,
            });

            seenPaths.add(folderPath);
            folderMap.set(folderId, folderPath);
            selection.delete(folderId);
        } else if (selection.has(fileId)) {
            output.push({
                id: fileId,
                type: "file",
                name: file.name,
                path: file.name,
                s3Key: file.s3Key,
            });

            seenPaths.add(file.name);
            selection.delete(fileId);
        }

        // If a folder is added, add it's children
        const filePath = `${folderPath}${file.name}`;
        // Avoid adding duplicate files or clashing names that might
        // cause issues on the frontend
        if (folderMap.has(folderId) && !seenPaths.has(filePath)) {
            output.push({
                id: fileId,
                type: "file",
                name: file.name,
                path: filePath,
                s3Key: file.s3Key,
            });
            seenPaths.add(filePath);
        }
    }

    return output;
}

export async function getFilesAndFoldersByIds(ids: string[]) {
    const objectIdArray = ids.map((id) => new mongoose.mongo.ObjectId(id));

    const pipeline = [
        {
            $match: {
                $or: [
                    { _id: { $in: objectIdArray } }, // For folders
                    { "files._id": { $in: objectIdArray } }, // For files in folders
                ],
            },
        },
        {
            $project: {
                id: "$_id",
                type: { $literal: "folder" },
                name: 1,
                files: {
                    $map: {
                        input: "$files",
                        as: "file",
                        in: {
                            id: "$$file._id",
                            type: { $literal: "file" },
                            s3Key: "$$file.s3Key",
                            name: "$$file.name",
                            mimeType: "$$file.mimeType",
                        },
                    },
                },
            },
        },
        {
            $unwind: {
                path: "$files",
                preserveNullAndEmptyArrays: true,
            },
        },
    ];

    const result = await FolderModel.aggregate(pipeline);

    // Initialize an empty array to store the final output
    const finalResult = transformResultWithPaths(result, new Set(ids));

    return finalResult as (
        | {
              id: string;
              type: "folder";
              name: string;
              path: string;
          }
        | {
              id: string;
              type: "file";
              s3Key: string;
              name: string;
              path: string;
          }
    )[];
}
