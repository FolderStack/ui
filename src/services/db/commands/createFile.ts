import { FileModel, IFile } from "../models/file";
import { isValidId } from "../utils/isValidID";

export const createFile = async (
    folderId: string,
    data: Partial<IFile>
): Promise<any> => {
    if (!data || !data.name || !folderId) {
        throw new Error("Missing required fields for file creation.");
    }

    if (!isValidId(folderId)) {
        throw new Error("Invalid folder ID.");
    }

    const newFile = new FileModel(data);
    return await newFile.save();
};
