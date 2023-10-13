import { FileModel } from "../models/file";
import { isValidId } from "../utils/isValidID";

export async function deleteFile(fileId: string): Promise<any> {
    if (!isValidId(fileId)) {
        throw new Error("Invalid file ID.");
    }

    const deletedFile = await FileModel.findByIdAndDelete(fileId).exec();
    if (!deletedFile) {
        throw new Error("File not found.");
    }

    return deletedFile;
}
