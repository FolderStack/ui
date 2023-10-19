import mongoose, { ObjectId, Schema } from "mongoose";

export interface IFileSystemObject {
    id: string;
    type: "file" | "folder";
    name: string;
    s3Key?: string;
    s3Url?: string;
    fileSize?: number;
    mimeType?: string;
    parent?: string | ObjectId | null;
    orgId: string | ObjectId;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    children?: (string | ObjectId)[];
    order?: number;
    root?: boolean;
}

// Unified Object Schema
const FileSystemObjectSchema = new Schema<IFileSystemObject>({
    type: { type: String, required: true, enum: ["file", "folder"] },
    name: { type: String, required: true },
    s3Key: { type: String },
    s3Url: { type: String },
    fileSize: { type: Number },
    mimeType: { type: String },
    parent: { type: Schema.Types.ObjectId, default: null },
    orgId: { type: String, required: true },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    children: [{ type: Schema.Types.ObjectId, ref: "FileSystemObject" }],
    root: { type: Boolean },
    order: { type: Number },
});

let FileSystemObjectModel: mongoose.Model<IFileSystemObject>;
try {
    FileSystemObjectModel =
        mongoose.model<IFileSystemObject>("FileSystemObject");
} catch (error) {
    FileSystemObjectModel = mongoose.model<IFileSystemObject>(
        "FileSystemObject",
        FileSystemObjectSchema
    );
}

export { FileSystemObjectModel };
