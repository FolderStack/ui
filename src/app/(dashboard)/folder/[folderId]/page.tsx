"use server";

import { authOptions } from "@/services/auth";
import { getFolderContents } from "@/services/db/queries/getFolderContents";
import { PageParamProps } from "@/types/params";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { FolderPageContent } from "./components/FolderPageContent";
import { getMetadata } from "./getMeta";

export async function generateMetadata(params: PageParamProps) {
    return getMetadata(params);
}

export default async function FolderPage(pageParams: PageParamProps) {
    const session = await getServerSession(authOptions);
    if (session == null) {
        return redirect("/auth/signin");
    }

    const [pageData] = await Promise.allSettled([
        getFolderContents(pageParams),
    ]);

    const data = pageData.status === "fulfilled" ? pageData?.value : null;

    if (data) {
        return <FolderPageContent items={data.items ?? []} />;
    }

    return null;
}
