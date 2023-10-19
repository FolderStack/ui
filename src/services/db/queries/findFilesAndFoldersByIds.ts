import mongoose from "mongoose";
import { FileSystemObjectModel } from "../models";
import { mongoConnect } from "../mongodb";

function flatten(item: any, arr = [] as any[]) {
    const { nested = [], ...rest } = item;
    arr.push(rest);
    for (const child of nested) {
        flatten(child, arr);
    }
}

function getPathToRoot(current: any, items: any[]) {
    if (!current) return "";
    let path = current.name;
    if (current.parent) {
        path =
            getPathToRoot(
                items.find((i: any) => String(i.id) === String(current.parent)),
                items
            ) + path;
    }
    if (current.type === "folder") {
        path += "/";
    }
    return path;
}

function flattenAndFindPaths(items: any[]) {
    const flat: any[] = [];
    for (const item of items) {
        flatten(item, flat);
    }

    return flat.map((item) => ({
        ...item,
        path: getPathToRoot(item, flat),
    }));
}

export async function getFilesAndFoldersByIds(ids: string[]) {
    await mongoConnect();

    const objectIdArray = ids.map((id) => new mongoose.mongo.ObjectId(id));

    const pipeline = [
        {
            $match: {
                _id: { $in: objectIdArray },
            },
        },
        {
            $graphLookup: {
                from: "filesystemobjects",
                startWith: "$_id",
                connectFromField: "_id",
                connectToField: "parent",
                as: "nested",
                depthField: "depth",
            },
        },
        {
            $project: {
                id: "$_id",
                type: 1,
                name: 1,
                parent: 1,
                s3Key: 1,
                nested: {
                    $map: {
                        input: "$nested",
                        as: "nestedItem",
                        in: {
                            id: "$$nestedItem._id",
                            name: "$$nestedItem.name",
                            parent: "$$nestedItem.parent",
                            type: "$$nestedItem.type",
                            s3Key: "$$nestedItem.s3Key",
                        },
                    },
                },
            },
        },
    ];

    const result = await FileSystemObjectModel.aggregate(pipeline).exec();
    const flattened = flattenAndFindPaths(result);

    return flattened;
}
