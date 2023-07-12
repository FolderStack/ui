"use client";
import { PageData } from "@/types";
import { PropsWithChildren, createContext, useEffect } from "react";
import { useOrg } from "../Org";
import { useFetchPageData } from "../useFetchPageData";
import { TreeProvider } from "./TreeContext";

interface PageDataContext {
    data: PageData;
    isLoading: boolean;
}

export const PageDataContext = createContext<PageDataContext>({
    data: {},
    isLoading: false,
});

export function PageDataProvider({ children }: PropsWithChildren) {
    const org = useOrg();
    const { data, isLoading } = useFetchPageData();

    useEffect(() => {
        const name = data?.data?.current?.name;
        if (name) {
            let docName = name;
            if (org.org?.name) {
                docName += " | " + org.org.name;
            }
            document.title = docName;
        }
    }, [data, org]);

    return (
        <TreeProvider>
            <PageDataContext.Provider value={{ data, isLoading }}>
                {children}
            </PageDataContext.Provider>
        </TreeProvider>
    );
}
