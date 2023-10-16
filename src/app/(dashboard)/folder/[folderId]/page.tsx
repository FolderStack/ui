import { getFolderContents } from "@/services/db/queries/getFolderContents";
import { PageParamProps } from "@/types/params";
import { FolderPageContent } from "./components/FolderPageContent";

export default async function FolderPage(pageParams: PageParamProps) {
    const [pageData] = await Promise.allSettled([
        getFolderContents(pageParams),
    ]);

    const data = pageData.status === "fulfilled" ? pageData?.value : null;

    if (data) {
        return <FolderPageContent items={data.items ?? []} />;
    }

    return null;
}
