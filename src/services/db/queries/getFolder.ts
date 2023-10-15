import { removeObjectIds } from "@/services/db/utils/removeObjectIds";
import { toObjectId } from "@/services/db/utils/toObjectId";
import { PageParamProps } from "@/types/params";
import { FolderModel } from "../models";
import { mongoConnect } from "../mongodb";
import { isValidId } from "../utils";

export async function getFolder(params: PageParamProps) {
    let { folderId } = params.params;
    if (folderId instanceof Array) {
        folderId = folderId[0] ?? null;
    }

    folderId = isValidId(folderId) ? toObjectId(folderId) : null;

    if (folderId === null) {
        return {
            id: null,
            name: "Home",
            parent: null,
            createdBy: "system",
            createdAt: new Date(0).toISOString(),
            updatedAt: null,
        };
    }

    const pipeline = [
        { $match: { _id: folderId } },
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
