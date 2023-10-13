import { FileModel } from "../models/file";
import { FolderModel } from "../models/folder";
import { isValidId } from "../utils/isValidID";

export async function deleteFolder(folderId: string): Promise<any> {
    if (!isValidId(folderId)) {
        throw new Error("Invalid folder ID.");
    }

    // Recursive function to delete folder and its children
    const deleteFolderRecursively = async (id: string) => {
        const folder = await FolderModel.findById(id).exec();
        if (!folder) {
            throw new Error(`Folder with ID ${id} not found.`);
        }

        // Delete child files
        await FileModel.deleteMany({ folderId: id }).exec();

        // Delete child folders recursively
        const childFolders = await FolderModel.find({ parent: id }).exec();
        for (const childFolder of childFolders) {
            await deleteFolderRecursively(childFolder._id);
        }

        // Finally, delete the folder itself
        await FolderModel.findByIdAndDelete(id).exec();
    };

    await deleteFolderRecursively(folderId);

    return { message: "Folder and its children have been deleted." };
}
