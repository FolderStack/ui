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
        this.checkPermission();

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

    protected checkPermission() {
        // Dropbox-specific permission checks here
    }
}
