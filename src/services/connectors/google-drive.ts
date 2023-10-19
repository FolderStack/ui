import { drive_v3, google } from "googleapis";
import { FileSystemConnector, FileSystemObject } from "./base";

export class GoogleDriveFileSystemConnector extends FileSystemConnector {
    private drive: drive_v3.Drive;

    constructor(
        orgId: string,
        userId: string,
        clientConfiguration: { auth: any }
    ) {
        super(orgId, userId);
        this.drive = google.drive({
            version: "v3",
            auth: clientConfiguration.auth,
        });
    }

    async tree(folderId = "root"): Promise<FileSystemObject[]> {
        const params: drive_v3.Params$Resource$Files$List = {
            q: `'${folderId}' in parents and trashed = false`,
            fields: "files(id, name, mimeType)",
        };

        const res = await this.drive.files.list(params);
        const files = res.data.files || [];

        const objects: FileSystemObject[] = files.map((file: any) => ({
            name: file.name || "",
            type:
                file.mimeType === "application/vnd.google-apps.folder"
                    ? "folder"
                    : "file",
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
