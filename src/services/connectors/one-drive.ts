import axios from "axios";
import { FileSystemConnector, FileSystemObject } from "./base";

export class OneDriveFileSystemConnector extends FileSystemConnector {
    private accessToken: string;

    constructor(
        orgId: string,
        userId: string,
        clientConfiguration: { accessToken: string }
    ) {
        super(orgId, userId);
        this.accessToken = clientConfiguration.accessToken;
    }

    async tree(folderId = "root"): Promise<FileSystemObject[]> {
        const url =
            folderId === "root"
                ? "https://graph.microsoft.com/v1.0/me/drive/root/children"
                : `https://graph.microsoft.com/v1.0/me/drive/items/${folderId}/children`;

        const config = {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
            },
        };

        const response = await axios.get(url, config);
        const files = response.data.value || [];

        const objects: FileSystemObject[] = files.map((file: any) => ({
            name: file.name,
            type: file.folder ? "folder" : "file",
        }));

        return objects;
    }

    async getThumbnail(filePath: string): Promise<string | null> {
        return "";
    }
    getBulkThumbnails(
        filePaths: string[]
    ): Promise<Map<string, string | null>> {
        throw new Error("Method not implemented.");
    }
    upload(filePath: string, content: Buffer): Promise<void> {
        throw new Error("Method not implemented.");
    }
    download(filePath: string): Promise<Buffer> {
        throw new Error("Method not implemented.");
    }
    rename(oldPath: string, newPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    move(srcPath: string, destPath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(filePath: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    createReadStream(filePath: string): NodeJS.ReadableStream {
        throw new Error("Method not implemented.");
    }
    createWriteStream(filePath: string, meta?: any): NodeJS.WritableStream {
        throw new Error("Method not implemented.");
    }
}
