"use client";
import { PageData } from "@/types";
import { PropsWithChildren, createContext } from "react";
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
    const { data, isLoading } = useFetchPageData();

    return (
        <TreeProvider>
            <PageDataContext.Provider value={{ data, isLoading }}>
                {children}
            </PageDataContext.Provider>
        </TreeProvider>
    );
}
