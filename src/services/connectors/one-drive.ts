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
        this.checkPermission();

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

    protected checkPermission() {
        // Implement your OneDrive-specific permission logic
        // You have access to this.organizationId and this.userId
    }
}
