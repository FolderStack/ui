"use server";
import { removeObjectIds } from "@/services/db/utils/removeObjectIds";
import { toObjectId } from "@/services/db/utils/toObjectId";
import { PageParamProps } from "@/types/params";
import { getSortFilterAndPaginationParams } from "@/utils/getSortFilterAndPaginationParams";
import { FolderModel, IFile, IFolder } from "../models";
import { mongoConnect } from "../mongodb";
import { isValidId } from "../utils/isValidID";

export async function getFolderContents(params: PageParamProps) {
    let { folderId } = params.params;
    const { sort, sortBy, page, pageSize, ...filter } =
        getSortFilterAndPaginationParams(params);

    folderId =
        !folderId || folderId === "@root"
            ? "@root"
            : isValidId(folderId)
            ? toObjectId(folderId)
            : null;

    if (!folderId) return null;

    const isRoot = folderId === "@root";

    const matchConditionForFolders = {
        parent: isRoot ? null : toObjectId(folderId),
        root: { $ne: true }, // Exclude the virtual root folder from childFolders
    };

    const matchConditionForFiles = isRoot
        ? { root: true } // Specifically match only the virtual root folder for files
        : { _id: toObjectId(folderId) };

    const filterPipeline = [
        ...(filter.filterVisible === "1"
            ? [
                  ...(filter.from
                      ? [
                            {
                                $match: {
                                    createdAt: {
                                        $gte: new Date(filter.from),
                                    },
                                },
                            },
                        ]
                      : []),
                  ...(filter.to
                      ? [
                            {
                                $match: {
                                    createdAt: {
                                        $lte: new Date(filter.to),
                                    },
                                },
                            },
                        ]
                      : []),
                  ...(filter.fileTypes
                      ? [
                            {
                                $match: {
                                    mimeType: {
                                        $in: filter.fileTypes,
                                    },
                                },
                            },
                        ]
                      : []),
              ]
            : []),
    ];

    const countPipeline: any[] = [
        {
            $match: {
                $or: [matchConditionForFolders, matchConditionForFiles],
            },
        },
        {
            $facet: {
                childFolders: [{ $match: { parent: folderId } }],
                parentFiles: [
                    { $match: { _id: folderId } },
                    { $unwind: "$files" },
                ],
                ...filterPipeline,
            },
        },
        {
            $project: {
                totalItems: {
                    $add: [
                        { $size: "$childFolders" },
                        { $size: "$parentFiles" },
                    ],
                },
            },
        },
    ];

    // Construct the aggregation pipeline
    let pipeline: any[] = [
        {
            $match: {
                $or: [matchConditionForFolders, matchConditionForFiles],
            },
        },
        {
            $facet: {
                childFolders: [
                    {
                        $match: matchConditionForFolders,
                    },
                    {
                        $addFields: {
                            type: "folder",
                        },
                    },
                ],
                parentFiles: [
                    {
                        $match: matchConditionForFiles,
                    },
                    {
                        $unwind: "$files",
                    },
                    {
                        $replaceRoot: { newRoot: "$files" },
                    },
                    ...filterPipeline,
                    {
                        $addFields: {
                            type: "file",
                        },
                    },
                ],
            },
        },
        {
            $project: {
                allItems: {
                    $concatArrays: ["$childFolders", "$parentFiles"],
                },
            },
        },
        {
            $unwind: "$allItems",
        },
        {
            $replaceRoot: { newRoot: "$allItems" },
        },
        {
            $sort: {
                [`${sortBy}`]: sort === "asc" ? 1 : -1,
            },
        },
        {
            $skip: (page - 1) * pageSize,
        },
        {
            $limit: pageSize,
        },
    ];

    await mongoConnect();

    const [items, count] = await Promise.allSettled([
        FolderModel.aggregate(pipeline).exec(),
        FolderModel.aggregate(countPipeline).exec(),
    ]);

    if (items.status === "rejected") {
        return {
            success: false,
            message: items.reason,
        };
    } else if (count.status === "rejected") {
        return {
            success: false,
            message: count.reason,
        };
    }

    const totalItems = count.value[0]?.totalItems ?? 0;

    return {
        items: removeObjectIds<(IFolder | IFile)[]>(items.value),
        pagination: {
            totalItems,
            found: items.value.length,
            page,
            pageSize,
        },
    };
}
