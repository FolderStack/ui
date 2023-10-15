import { removeObjectIds } from "@/services/db/utils/removeObjectIds";
import { toObjectId } from "@/services/db/utils/toObjectId";
import { PageParamProps } from "@/types/params";
import { FolderModel } from "../models";
import { mongoConnect } from "../mongodb";

export async function getFolder(params: PageParamProps) {
    let { folderId } = params.params;
    if (folderId instanceof Array) {
        folderId = folderId[0] ?? null;
    }

    const pipeline = [
        { $match: { _id: toObjectId(folderId) } },
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

    await mongoConnect();
    const [folderInfo] = await FolderModel.aggregate(pipeline).exec();

    if (folderInfo) {
        return removeObjectIds(folderInfo);
    }

    return null;
}
