import { PageParamProps } from "@/types/params";
import { getSortFilterAndPaginationParams } from "@/utils/getSortFilterAndPaginationParams";
import mongoose from "mongoose";
import { FolderModel, IFolder } from "../models/folder";

export async function getFolderContents(params: PageParamProps): Promise<{
    items: IFolder[];
    pagination: {
        totalItems: number;
        found: number;
        page: number;
        pageSize: number;
    };
} | null> {
    const { folderId } = params.params;
    const { sort, sortBy, page, pageSize, ...filter } =
        getSortFilterAndPaginationParams(params);

    if (!folderId) return null;

    // Construct the aggregation pipeline
    let pipeline: any[] = [
        { $match: { _id: new mongoose.Types.ObjectId(folderId) } },
        {
            $unwind: {
                path: "$files",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $sort: {
                [`files.${sortBy}`]: sort === "asc" ? 1 : -1,
            },
        },
    ];

    // Additional filters
    if (filter.filterVisible === "1") {
        if (filter.from)
            pipeline.push({
                $match: { "files.createdAt": { $gte: new Date(filter.from) } },
            });
        if (filter.to)
            pipeline.push({
                $match: { "files.createdAt": { $lte: new Date(filter.to) } },
            });
        if (filter.fileTypes)
            pipeline.push({
                $match: { "files.mimeType": { $in: filter.fileTypes } },
            });
    }

    // Pagination
    pipeline.push({ $skip: (page - 1) * pageSize }, { $limit: pageSize });

    // Execute the aggregation query
    const items = await FolderModel.aggregate(pipeline).exec();

    // Get total items for pagination
    const totalItems = await FolderModel.countDocuments({
        _id: new mongoose.Types.ObjectId(folderId),
    });

    return {
        items,
        pagination: {
            totalItems,
            found: items.length,
            page,
            pageSize,
        },
    };
}
