import { BasicFolder, FolderModel } from "../models/folder";

export function arrayToTree(folders: BasicFolder[], parent?: string) {
    const tree: BasicFolder[] = [];
    folders.forEach((folder) => {
        if (folder.parent === parent) {
            const children = arrayToTree(folders, folder._id);
            if (children.length) {
                folder.children = children;
            }
            tree.push(folder);
        }
    });
    return tree;
}

export async function getFolderTree(orgId: string): Promise<BasicFolder[]> {
    const pipeline = [
        { $match: { organisationId: orgId } },
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
                organisationId: 1,
                tree: 1,
                depth: 1,
            },
        },
    ];

    const folderTree = await FolderModel.aggregate(pipeline).exec();
    return folderTree;
}
