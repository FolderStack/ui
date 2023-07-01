import { PageData } from "@/types";
import { PropsWithChildren, createContext, useContext } from "react";
import { useFetchPageData } from "../useFetchPageData";

interface PageDataContext {
    data: PageData;
    isLoading: boolean;
}

const PageDataContext = createContext<PageDataContext>({
    data: {},
    isLoading: false,
});

export function PageDataProvider({ children }: PropsWithChildren) {
    const { data, isLoading } = useFetchPageData();

    return (
        <PageDataContext.Provider value={{ data, isLoading }}>
            {children}
        </PageDataContext.Provider>
    );
}

export function usePageData() {
    return useContext(PageDataContext);
}
