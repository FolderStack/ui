import mongoose, { ObjectId, Schema } from "mongoose";

export interface IFile {
    id: string;
    s3Key: string;
    s3Url: string;
    name: string;
    fileSize: number;
    mimeType: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    folderId: ObjectId;
}

// File Schema (Embedded)
export const FileSchema = new Schema<IFile>({
    s3Key: { type: String, required: true },
    s3Url: { type: String, required: true },
    name: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    folderId: { type: mongoose.Types.ObjectId },
});

let FileModel: mongoose.Model<IFile>;
try {
    FileModel = mongoose.model<IFile>("File");
} catch (error) {
    FileModel = mongoose.model<IFile>("File", FileSchema);
}

export interface IFolder {
    id: string | mongoose.Types.ObjectId;
    name: string;
    parent: string | mongoose.Types.ObjectId | null;
    orgId: string | mongoose.Types.ObjectId;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    children: (string | mongoose.Types.ObjectId)[];
    files: IFile[];
    order?: number;
    root?: boolean;
}

export interface BasicFolder {
    id: string;
    name: string;
    parent?: string;
    children?: BasicFolder[];
    order?: number;
}

// Folder Schema
const FolderSchema = new Schema<IFolder>({
    name: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, default: null },
    orgId: { type: String, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    children: [{ type: Schema.Types.ObjectId, ref: "Folder" }],
    root: { type: Boolean },
    order: { type: Number },
    files: [FileSchema],
});

let FolderModel: mongoose.Model<IFolder>;
try {
    FolderModel = mongoose.model<IFolder>("Folder");
} catch (error) {
    FolderModel = mongoose.model<IFolder>("Folder", FolderSchema);
}

export { FileModel, FolderModel };
