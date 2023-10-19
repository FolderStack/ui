"use server";
import mongoose from "mongoose";
import { FileSystemObjectModel } from "../models";

export async function findOrCreateRootFolder(
    orgId: string,
    session?: mongoose.ClientSession
) {
    let folder = await FileSystemObjectModel.findOne({
        type: "folder",
        root: true,
        orgId,
    }).session(session ?? null);

    if (!folder) {
        folder = (
            await FileSystemObjectModel.create(
                [
                    {
                        name: "Home",
                        type: "folder",
                        root: true,
                        parent: null,
                        orgId,
                        children: [],
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
