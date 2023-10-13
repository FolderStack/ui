import { api } from "@/config/api";
import { PageParamProps } from "@/types/params";

export function buildUrl({ params, searchParams }: PageParamProps) {
    const { folderId } = params;

    if (!folderId) return null;

    const {
        display = "grid",
        page = "1",
        pageSize = "20",
        sort = "asc",
        sortBy = "name",
        from,
        to,
        fileTypes,
    } = searchParams;

    const url = new URL(api.url + `/folders/${folderId}`);

    url.searchParams.set("display", display.toString());
    url.searchParams.set("page", page.toString());
    url.searchParams.set("pageSize", pageSize.toString());
    url.searchParams.set("sort", sort.toString());
    url.searchParams.set("sortBy", sortBy.toString());
    from && url.searchParams.set("from", from.toString());
    to && url.searchParams.set("to", to.toString());
    fileTypes && url.searchParams.set("fileTypes", fileTypes.toString());

    return url.toString();
}
