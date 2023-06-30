import { PropsWithChildren, createContext, useContext } from "react";
import { useFetchPageData } from "../usePageData";

const PageDataContext = createContext<{ data: any }>({
    data: {},
});

export function PageDataProvider({ children }: PropsWithChildren) {
    const data = useFetchPageData();

    return (
        <PageDataContext.Provider value={{ data }}>
            {children}
        </PageDataContext.Provider>
    );
}

export function usePageData() {
    return useContext(PageDataContext);
}
