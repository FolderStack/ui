"use server";
import { removeObjectIds } from "@/services/db/utils/removeObjectIds";
import { toObjectId } from "@/services/db/utils/toObjectId";
import { PageParamProps } from "@/types/params";
import { getSortFilterAndPaginationParams } from "@/utils/getSortFilterAndPaginationParams";
import { FileSystemObjectModel, IFileSystemObject } from "../models";
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

    const matchCondition = {
        parent: isRoot ? null : toObjectId(folderId),
        root: { $ne: true }, // Exclude the virtual root folder
        type: { $in: ["file", "folder"] }, // Add this line if you have a 'type' field
    };

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
            $match: matchCondition,
        },
        ...filterPipeline,
        {
            $group: {
                _id: null,
                totalItems: { $sum: 1 },
            },
        },
    ];

    // Construct the aggregation pipeline
    let pipeline: any[] = [
        {
            $match: matchCondition,
        },
        ...filterPipeline,
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
        FileSystemObjectModel.aggregate(pipeline).exec(),
        FileSystemObjectModel.aggregate(countPipeline).exec(),
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
        items: removeObjectIds<IFileSystemObject[]>(items.value),
        pagination: {
            totalItems,
            found: items.value.length,
            page,
            pageSize,
        },
    };
}
