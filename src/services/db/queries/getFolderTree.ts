import { removeObjectIds } from "@/services/db/utils/removeObjectIds";
import { BasicFolder, FolderModel } from "../models";
import { mongoConnect } from "../mongodb";

export function arrayToTree(folders: BasicFolder[], parent?: string) {
    const tree: BasicFolder[] = [];
    folders.forEach((folder) => {
        if (folder.parent === parent) {
            const children = arrayToTree(folders, folder.id);
            if (children.length) {
                folder.children = children;
            }
            tree.push(folder);
        }
    });
    return tree;
}

export async function getFolderTree(orgId: string) {
    const pipeline = [
        { $match: { orgId } },
        {
            $graphLookup: {
                from: "folders", // the collection name should be 'folders' as per Mongoose conventions
                startWith: "$_id",
                connectFromField: "children",
                connectToField: "_id",
                as: "tree",
                depthField: "depth",
            },
        },
        {
            $project: {
                name: 1,
                parent: 1,
                orgId: 1,
                tree: 1,
                depth: 1,
                order: 1,
            },
        },
    ];

    await mongoConnect();
    const folderTree = await FolderModel.aggregate(pipeline).exec();
    return removeObjectIds<BasicFolder[]>(folderTree);
}
