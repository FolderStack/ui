import { PermissionModel } from "../db/models/permission";

export interface FileSystemObject {
    name: string;
    type: "folder" | "file";
    [key: string]: string | number;
}

export abstract class FileSystemConnector {
    protected orgId: string;
    protected userId: string;

    constructor(orgId: string, userId: string) {
        this.orgId = orgId;
        this.userId = userId;
    }

    abstract tree(prefix?: string): Promise<FileSystemObject[]>;
    abstract getThumbnail(filePath: string): Promise<string | null>;
    abstract getBulkThumbnails(
        filePaths: string[]
    ): Promise<Map<string, string | null>>;
    abstract upload(filePath: string, content: Buffer): Promise<void>;
    abstract download(filePath: string): Promise<Buffer>;
    abstract rename(oldPath: string, newPath: string): Promise<void>;
    abstract move(srcPath: string, destPath: string): Promise<void>;
    abstract delete(filePath: string): Promise<void>;
    abstract createReadStream(filePath: string): NodeJS.ReadableStream;
    abstract createWriteStream(
        filePath: string,
        meta?: any
    ): NodeJS.WritableStream;

    protected async checkPermission(
        orgId: string,
        userId: string,
        folderId: string,
        fileIdOrPath?: string
    ): Promise<"read" | "write" | "none"> {
        const permission = await PermissionModel.findOne({
            orgId,
            folderId,
            sharedWithUserId: userId,
        }).exec();

        if (!permission) {
            return "none";
        }

        if (fileIdOrPath && !permission.files.includes(fileIdOrPath)) {
            return "none";
        }

        return permission.permissionType as "read" | "write" | "none";
    }

    async checkBulkPermission(
        userId: string,
        fileIds: string[]
    ): Promise<string[]> {
        // Bulk check permissions here
        // Return an array of file IDs that the user is authorized to access
        return [];
    }
}
