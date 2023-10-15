"use server";

import { authOptions } from "@/services/auth";
import { createFolder } from "@/services/db/commands/createFolder";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function createFolderAction(_: any, form: FormData) {
    const name = form.get("name");
    const parent = form.get("parent");

    if (typeof name !== "string") {
        return { success: false, message: "Invalid name" };
    }

    if (parent && typeof parent !== "string") {
        return { success: false, message: "Invalid parent folder" };
    }

    const session = await getServerSession(authOptions);
    const orgId = session?.user?.orgId;
    const userId = session?.user?.id;

    if (!orgId || !userId) {
        redirect("/api/auth/signin");
    }

    try {
        await createFolder({
            name,
            orgId,
            createdBy: userId,
            parent: parent ?? undefined,
        });

        revalidateTag(parent ?? "root");

        return { success: true, message: "Created folder" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
