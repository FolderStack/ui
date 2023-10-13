import mongoose, { Document, Schema } from "mongoose";
import { FileSchema, IFile } from "./file";

export interface IFolder extends Document {
    name: string;
    parent: string | null;
    orgId: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    children: string[];
    files: IFile[];
}

export interface BasicFolder {
    _id: string;
    name: string;
    parent?: string;
    children?: BasicFolder[];
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
    files: [FileSchema],
});

export const FolderModel = mongoose.model<IFolder>("Folder", FolderSchema);
