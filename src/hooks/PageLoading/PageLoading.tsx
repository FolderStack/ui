import { PropsWithChildren, createContext, useContext } from "react";
import { useBoolean } from "../useBoolean";

const PageLoadingContext = createContext({
    isLoading: true,
    loading: {
        on() {},
        off() {},
        toggle() {},
    },
});

// Search `usePageLoading` to find where the page loading is terminated.
// Currently in `UserProvider`.

export function PageLoadingProvider({ children }: PropsWithChildren) {
    const [isLoading, loading] = useBoolean(true);
    return (
        <PageLoadingContext.Provider value={{ isLoading, loading }}>
            {children}
        </PageLoadingContext.Provider>
    );
}

export const PageLoadingConsumer = PageLoadingContext.Consumer;
export const usePageLoading = () => useContext(PageLoadingContext);
