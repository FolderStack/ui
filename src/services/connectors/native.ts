import { PassThrough } from "stream";
import { oldS3 } from "../aws/s3";
import { FileSystemObjectModel } from "../db/models";
import { mongoConnect } from "../db/mongodb";
import { removeObjectIds } from "../db/utils/removeObjectIds";
import { FileSystemConnector, FileSystemObject } from "./base";

export class NativeFileSystemConnector extends FileSystemConnector {
    constructor(orgId: string, userId: string) {
        super(orgId, userId);
    }

    async tree(): Promise<FileSystemObject[]> {
        await mongoConnect();

        const pipeline = [
            { $match: { orgId: this.orgId, type: "folder", root: true } },
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

        const folderTree = await FileSystemObjectModel.aggregate(
            pipeline
        ).exec();
        const treeFromRoot = folderTree[0].tree.filter((v: any) => !v.root);

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

    upload(key: string, content: Buffer): Promise<void> {
        throw new Error("Method not implemented.");
    }

    download(key: string): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }

    rename(oldPath: string, newPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    move(srcPath: string, destPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    delete(key: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    createReadStream(key: string): NodeJS.ReadableStream {
        return oldS3
            .getObject({
                Bucket: "your-bucket-name",
                Key: key,
            })
            .createReadStream();
    }

    createWriteStream(key: string, meta: any): NodeJS.WritableStream {
        const pass = new PassThrough();
        oldS3.upload(
            {
                Bucket: process.env.AWS_BUCKET_NAME!,
                Key: key,
                Body: pass,
            },
            async (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                mongoConnect().then(() => {
                    FileSystemObjectModel.create({
                        orgId: this.orgId,
                        userId: this.userId,
                        s3Key: key,
                        ...(meta ?? {}),
                    });
                });
            }
        );
        return pass;
    }

    async getThumbnail(filePath: string): Promise<string | null> {
        return "S3_thumbnail_url";
    }

    getBulkThumbnails(
        filePaths: string[]
    ): Promise<Map<string, string | null>> {
        throw new Error("Method not implemented.");
    }
}
