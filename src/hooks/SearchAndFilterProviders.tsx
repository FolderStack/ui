import { PropsWithChildren } from "react";
import { DisplayTypeProvider } from "./DisplayType";
import { FileUploadProvider } from "./FileUpload";
import { FilterProvider } from "./Filter";
import { PageDataProvider } from "./PageData";
import { PaginationProvider } from "./Pagination";
import { SelectionProvider } from "./Selection";
import { SortProvider } from "./Sort";

export function SearchAndFilterProviders({ children }: PropsWithChildren) {
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
