import { flags } from "@/config/flags";
import { BreadcrumbsLoading } from "./Breadcrumbs/BreadcrumbsLoading";

export function QueryActionsLoading() {
    return (
        <div className="w-full space-y-4">
            <div className="flex flex-row space-between items-center w-full">
                <span>
                    <BreadcrumbsLoading />
                    <div className="rounded animate-pulse bg-gray-200 h-[40px] w-64" />
                </span>
                {flags.showSort && (
                    <span className="flex flex-row space-x-2 ml-auto mt-2">
                        <div className="rounded animate-pulse bg-gray-200 h-[36px] w-[144px]" />
                        <div className="rounded animate-pulse bg-gray-200 h-[36px] w-[36px]" />
                        {/* <div className="rounded animate-pulse bg-gray-200 h-[36px] w-[36px]" /> */}
                    </span>
                )}
            </div>
            {flags.showFilters && (
                <div className="flex justify-end">
                    <div className="flex flex-row space-x-4">
                        <div>
                            <div className="rounded animate-pulse bg-gray-300 h-[18px] w-[78px] mb-0.5" />
                            <div className="rounded animate-pulse bg-gray-200 h-[42px] w-[180px]" />
                        </div>
                        <div>
                            <div className="rounded animate-pulse bg-gray-300 h-[18px] w-[78px] mb-0.5" />
                            <div className="rounded animate-pulse bg-gray-200 h-[42px] w-[180px]" />
                        </div>
                        <div className="flex flex-row h-100 space-x-4">
                            <div className="flex flex-col h-full items-end">
                                <div className="animate-pulse bg-gray-200 mt-auto w-[116px] h-[42px] rounded px-4 py-1 shadow-sm" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
