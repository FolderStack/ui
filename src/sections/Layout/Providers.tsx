import {
    DisplayTypeProvider,
    FileUploadProvider,
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
                        <FileUploadProvider>
                            <SelectionProvider>
                                <DisplayTypeProvider>
                                    {children}
                                </DisplayTypeProvider>
                            </SelectionProvider>
                        </FileUploadProvider>
                    </PageDataProvider>
                </FilterProvider>
            </SortProvider>
        </PaginationProvider>
    );
}
