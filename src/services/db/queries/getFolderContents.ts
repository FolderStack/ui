import { removeObjectIds } from "@/services/db/utils/removeObjectIds";
import { toObjectId } from "@/services/db/utils/toObjectId";
import { PageParamProps } from "@/types/params";
import { getSortFilterAndPaginationParams } from "@/utils/getSortFilterAndPaginationParams";
import { FolderModel, IFile, IFolder } from "../models";
import { mongoConnect } from "../mongodb";
import { isValidId } from "../utils";

export async function getFolderContents(params: PageParamProps) {
    let { folderId } = params.params;
    const { sort, sortBy, page, pageSize, ...filter } =
        getSortFilterAndPaginationParams(params);

    folderId = isValidId(folderId) ? toObjectId(folderId) : null;

    const matchCondition =
        folderId === null
            ? { parent: { $eq: null } }
            : {
                  $or: [
                      { parent: toObjectId(folderId) },
                      { _id: toObjectId(folderId) },
                  ],
              };

    const countPipeline: any[] = [
        {
            $match: matchCondition,
        },
        {
            $facet: {
                childFolders: [{ $match: { parent: folderId } }],
                parentFiles: [
                    { $match: { _id: folderId } },
                    { $unwind: "$files" },
                    // ... your existing filter logic here
                ],
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
            $match: matchCondition,
        },
        {
            $facet: {
                childFolders: [
                    {
                        $match: {
                            parent: folderId,
                        },
                    },
                    {
                        $addFields: {
                            type: "folder",
                        },
                    },
                ],
                parentFiles: [
                    {
                        $match: {
                            _id: folderId,
                        },
                    },
                    {
                        $unwind: "$files",
                    },
                    {
                        $replaceRoot: { newRoot: "$files" },
                    },
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
