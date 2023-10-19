import { api } from "@/config/api";
import { PageParamProps } from "@/types/params";

export function buildUrl({ params, searchParams }: PageParamProps) {
    const { folderId } = params;

    if (!folderId) return null;

    const {
        page = "1",
        pageSize = "20",
        sort = "asc",
        sortBy = "name",
        from,
        to,
        fileTypes,
    } = searchParams;

    const url = new URL(api.url + `/folders/${folderId}`);

    // url.searchParams.set("display", display.toString());
    url.searchParams.set("page", String(page));
    url.searchParams.set("pageSize", String(pageSize));
    url.searchParams.set("sort", String(sort));
    url.searchParams.set("sortBy", String(sortBy));
    from && url.searchParams.set("from", String(from));
    to && url.searchParams.set("to", String(to));
    fileTypes && url.searchParams.set("fileTypes", String(fileTypes));

    return url.toString();
}
