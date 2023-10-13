import { FolderModel, IFolder } from "../models/folder";

export async function createFolder(data: Partial<IFolder>): Promise<any> {
    if (!data || !data.name || !data.orgId) {
        throw new Error("Missing required fields for folder creation.");
    }

    const newFolder = new FolderModel(data);
    return await newFolder.save();
}
