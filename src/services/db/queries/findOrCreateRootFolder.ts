import mongoose from "mongoose";
import { FolderModel } from "../models";

export async function findOrCreateRootFolder(
    orgId: string,
    session?: mongoose.ClientSession
) {
    let folder = await FolderModel.findOne({ root: true, orgId }).session(
        session ?? null
    );
    if (!folder) {
        folder = (
            await FolderModel.create(
                [
                    {
                        name: "root",
                        root: true,
                        parent: null,
                        orgId,
                        files: [],
                        folder: [],
                        createdAt: new Date(),
                        createdBy: "system",
                    },
                ],
                { session }
            )
        )[0];
    }
    return folder;
}
