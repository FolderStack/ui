import { PageParamProps } from "@/types/params";
import mongoose from "mongoose";
import { FolderModel, IFolder } from "../models/folder";

export async function getFolder(
    params: PageParamProps
): Promise<IFolder | null> {
    const { folderId } = params.params;

    if (!folderId) return null;

    const pipeline = [
        { $match: { _id: new mongoose.Types.ObjectId(folderId) } },
        {
            $project: {
                name: 1,
                parent: 1,
                organizationId: 1,
                createdBy: 1,
                createdAt: 1,
                updatedAt: 1,
            },
        },
    ];

    const [folderInfo] = await FolderModel.aggregate(pipeline).exec();

    if (folderInfo) {
        return folderInfo;
    }

    return null;
}
