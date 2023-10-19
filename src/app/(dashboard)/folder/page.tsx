import { PageParamProps } from "@/types/params";
import { getMetadata } from "./[folderId]/getMeta";

export async function generateMetadata(params: PageParamProps) {
    return getMetadata(params);
}

export { default } from "./[folderId]/page";
