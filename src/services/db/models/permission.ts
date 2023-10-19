import mongoose from "mongoose";

export interface IPermission {
    orgId: string;
    folderId: string;
    ownerUserId: string;
    sharedWithUserId: string;
    permissionType: string;
    files: string[];
}

const PermissionSchema = new mongoose.Schema({
    orgId: String,
    folderId: String, // The ID of the folder, or the connection ID of a linked folder
    ownerUserId: String, // ID of the user who owns the folder
    sharedWithUserId: String, // ID of the user with whom the folder is shared
    permissionType: String, // e.g., 'read', 'write'
    files: [String], // Optional; Array of file IDs if only specific files are shared
});

let PermissionModel: mongoose.Model<IPermission>;
try {
    PermissionModel = mongoose.model<IPermission>("Permission");
} catch (error) {
    PermissionModel = mongoose.model<IPermission>(
        "Permission",
        PermissionSchema
    );
}

export { PermissionModel };
