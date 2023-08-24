"use client";
import { PageData } from "@/types";
import {
    PropsWithChildren,
    createContext,
    memo,
    useEffect,
    useMemo,
} from "react";
import { useOrg } from "../Org";
import { useFetchPageData } from "../useFetchPageData";
import { useStableParams } from "../useStableParams";
import { useTree } from "./TreeContext";

interface PageDataContext {
    name: string | null;
    data: PageData | null;
    isLoading: boolean;
    reload(cursor?: string): void;
}

export const PageDataContext = createContext<PageDataContext>({
    name: null,
    data: {} as any,
    isLoading: false,
    reload() {
        //
    },
});

function PageDataProviderComponent({ children }: PropsWithChildren) {
    const { org } = useOrg();
    const { getNameFromId } = useTree();
    const { folderId } = useStableParams();
    const { data, isLoading, reload } = useFetchPageData();

    const orgName = useMemo(() => org?.name, [org]);

    useEffect(() => {
        console.debug("PageDataProvider", "useEffect #1 (mount)");
        return () =>
            console.debug("PageDataProvider", "useEffect #1 (unmount)");
    }, []);

    useEffect(() => {
        const name = getNameFromId(folderId?.toString());
        if (name) {
            console.debug("PageDataProvider", "useEffect #2 (update title)");
            let docName = name;
            if (orgName) {
                docName += " | " + orgName;
            }
            if (typeof document !== "undefined") {
                document.title = docName;
            }
        }
    }, [orgName, getNameFromId, folderId]);

    return (
        <PageDataContext.Provider
            value={{
                name: getNameFromId(folderId?.toString()),
                data,
                isLoading,
                reload,
            }}
        >
            {children}
        </PageDataContext.Provider>
    );
}

export const PageDataProvider = memo(PageDataProviderComponent);
