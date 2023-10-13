import { FolderModel, IFolder } from "../models/folder";
import { isValidId } from "../utils/isValidID";

export async function updateFolder(
    folderId: string,
    data: Partial<IFolder>
): Promise<any> {
    if (!isValidId(folderId)) {
        throw new Error("Invalid folder ID.");
    }

    const updatedFolder = await FolderModel.findByIdAndUpdate(folderId, data, {
        new: true,
    }).exec();
    if (!updatedFolder) {
        throw new Error("Folder not found.");
    }

    return updatedFolder;
}
