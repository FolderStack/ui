"use client";
import { PageData } from "@/types";
import React, {
    PropsWithChildren,
    createContext,
    useEffect,
    useState,
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
    const org = useOrg();
    const tree = useTree();
    const { folderId } = useStableParams();
    const { data, isLoading, reload } = useFetchPageData();
    const [name, setName] = useState<string | null>(null);

    useEffect(() => {
        setName(tree.getNameFromId(folderId?.toString()));
    }, [tree, folderId]);

    useEffect(() => {
        if (name) {
            let docName = name;
            if (org.org?.name) {
                docName += " | " + org.org.name;
            }
            if (typeof document !== "undefined") {
                document.title = docName;
            }
        }
    }, [org, name]);

    return (
        <PageDataContext.Provider value={{ name, data, isLoading, reload }}>
            {children}
        </PageDataContext.Provider>
    );
}

export const PageDataProvider = React.memo(PageDataProviderComponent);
