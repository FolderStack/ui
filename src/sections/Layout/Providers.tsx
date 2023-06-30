import {
    DisplayTypeProvider,
    FilterProvider,
    PageDataProvider,
    PaginationProvider,
    SelectionProvider,
    SortProvider,
} from "@/hooks";
import { PropsWithChildren } from "react";

export function MainLayoutProviders({ children }: PropsWithChildren) {
    return (
        <PaginationProvider>
            <SortProvider>
                <FilterProvider>
                    <PageDataProvider>
                        <SelectionProvider>
                            <DisplayTypeProvider>
                                {children}
                            </DisplayTypeProvider>
                        </SelectionProvider>
                    </PageDataProvider>
                </FilterProvider>
            </SortProvider>
        </PaginationProvider>
    );
}
