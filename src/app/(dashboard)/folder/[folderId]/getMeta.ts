"use server";
import { authOptions } from "@/services/auth";
import { getFolder } from "@/services/db/queries/getFolder";
import { getOrganisation } from "@/services/db/queries/getOrganisation";
import { PageParamProps } from "@/types/params";
import { getServerSession } from "next-auth";

export async function getMetadata(params: PageParamProps) {
    const session = await getServerSession(authOptions);
    const orgId = session?.user?.orgId;

    let orgName;
    if (orgId) {
        try {
            const org = await getOrganisation(orgId);
            orgName = org?.name;
        } catch (err) {
            //
        }
    }

    const folderId = params.params.folderId ?? null;
    const folder = await getFolder(folderId);
    const name = folder ? (folder.root ? "Home" : folder.name) : undefined;

    return {
        title: name
            ? `${name}${orgName ? " | " + orgName : ""}`
            : orgName || "",
    };
}
