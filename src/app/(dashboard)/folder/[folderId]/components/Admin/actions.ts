"use server";

import { authOptions } from "@/services/auth";
import { createFolder } from "@/services/db/commands/createFolder";
import { getServerSession } from "next-auth";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function createFolderAction(_: any, form: FormData) {
    const name = form.get("name");
    let parent = form.get("parent");
    parent = typeof parent === "string" && parent.length > 0 ? parent : null;

    if (typeof name !== "string") {
        return { success: false, message: "Invalid name" };
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
            parent,
        });

        if (parent) {
            revalidateTag(parent);
        } else {
            revalidatePath("/folder");
        }

        return { success: true, message: "Created folder" };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
