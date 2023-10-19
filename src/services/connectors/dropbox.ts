import axios from "axios";
import { FileSystemConnector, FileSystemObject } from "./base";

export class DropboxFileSystemConnector extends FileSystemConnector {
    private accessToken: string;

    constructor(
        orgId: string,
        userId: string,
        clientConfiguration: { accessToken: string }
    ) {
        super(orgId, userId);
        this.accessToken = clientConfiguration.accessToken;
    }

    async tree(folderPath: string = ""): Promise<FileSystemObject[]> {
        const config = {
            headers: {
                Authorization: `Bearer ${this.accessToken}`,
                "Content-Type": "application/json",
            },
        };
        const body = {
            path: folderPath,
            recursive: false,
        };

        const response = await axios.post(
            "https://api.dropboxapi.com/2/files/list_folder",
            body,
            config
        );
        const entries = response.data.entries || [];

        const objects: FileSystemObject[] = entries.map((entry: any) => ({
            name: entry.name,
            type: entry[".tag"] === "folder" ? "folder" : "file",
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
