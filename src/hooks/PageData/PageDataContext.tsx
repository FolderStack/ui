"use client";
import { PageData } from "@/types";
import React, { PropsWithChildren, createContext, useEffect } from "react";
import { useOrg } from "../Org";
import { useFetchPageData } from "../useFetchPageData";

interface PageDataContext {
    data: PageData;
    isLoading: boolean;
}

export const PageDataContext = createContext<PageDataContext>({
    data: {},
    isLoading: false,
});

function PageDataProviderComponent({ children }: PropsWithChildren) {
    const org = useOrg();
    const { data, isLoading } = useFetchPageData();

    useEffect(() => {
        const name = data?.data?.current?.name;
        if (name) {
            let docName = name;
            if (org.org?.name) {
                docName += " | " + org.org.name;
            }
            if (typeof document !== "undefined") {
                document.title = docName;
            }
        }
    }, [data, org]);

    return (
        <PageDataContext.Provider value={{ data, isLoading }}>
            {children}
        </PageDataContext.Provider>
    );
}

export const PageDataProvider = React.memo(PageDataProviderComponent);
