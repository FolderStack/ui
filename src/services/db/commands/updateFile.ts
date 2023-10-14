import { FileModel, IFile } from "../models";
import { isValidId } from "../utils/isValidID";

export async function updateFile(
    fileId: string,
    data: Partial<IFile>
): Promise<any> {
    if (!isValidId(fileId)) {
        throw new Error("Invalid file ID.");
    }

    const updatedFile = await FileModel.findByIdAndUpdate(fileId, data, {
        new: true,
    }).exec();
    if (!updatedFile) {
        throw new Error("File not found.");
    }

    return updatedFile;
}
