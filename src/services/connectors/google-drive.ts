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
        this.checkPermission(); // Checking permission

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

    protected checkPermission() {
        // Implement your Google Drive-specific permission logic
        // You have access to this.organizationId and this.userId
    }
}
