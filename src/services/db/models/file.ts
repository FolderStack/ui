import mongoose, { Schema } from "mongoose";

export interface IFile {
    s3Key: string;
    name: string;
    size: number;
    mimeType: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

// File Schema (Embedded)
export const FileSchema = new Schema<IFile>({
    s3Key: { type: String, required: true },
    name: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export const FileModel = mongoose.model<IFile>("File", FileSchema);
