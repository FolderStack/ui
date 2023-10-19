"use server";
import { removeObjectIds } from "@/services/db/utils/removeObjectIds";
import { FileSystemObjectModel } from "../models";
import { mongoConnect } from "../mongodb";

export async function getFolderTree(orgId: string) {
    await mongoConnect();

    const pipeline = [
        { $match: { orgId, type: "folder", root: true } },
        {
            $graphLookup: {
                from: "filesystemobjects",
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
                depth: 1,
                order: 1,
                tree: {
                    $filter: {
                        input: "$tree",
                        as: "item",
                        cond: { $eq: ["$$item.type", "folder"] },
                    },
                },
            },
        },
    ];

    const folderTree = await FileSystemObjectModel.aggregate(pipeline).exec();
    const treeFromRoot =
        folderTree[0]?.tree?.filter?.((v: any) => !v.root) ?? [];

    // Sort by order first, then by name
    treeFromRoot.sort((a: any, b: any) => {
        // Both have orders
        if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order;
        }
        // Only a has an order
        if (a.order !== undefined) {
            return -1;
        }
        // Only b has an order
        if (b.order !== undefined) {
            return 1;
        }
        // Neither have an order, sort by name
        return a.name.localeCompare(b.name);
    });

    return removeObjectIds<any[]>(treeFromRoot);
}
