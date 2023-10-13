import { FolderModel, IFolder } from "../models/folder";
import { mongoConnect } from "../mongodb";

export async function createFolder(data: Partial<IFolder>): Promise<any> {
    const db = await mongoConnect();

    if (!data || !data.name || !data.orgId) {
        throw new Error("Missing required fields for folder creation.");
    }

    const newFolder = new FolderModel(data);
    return await db?.connection.collection("folders").insertOne(newFolder);
}
