import { flags } from "@/config/flags";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export function PaginationActionsLoading() {
    if (!flags.showPagination) return null;
    return (
        <form className="flex flex-row space-x-6 ml-auto">
            <div className="flex flex-row items-center space-x-2 select-none">
                <button
                    disabled
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiChevronLeft />
                </button>
                <div className="flex flex-row items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                        <div
                            key={i}
                            className={
                                "rounded bg-gray-200 px-2 border-2 border-solid animate-pulse w-[28px] h-[28px]"
                            }
                        />
                    ))}
                </div>
                <button disabled className="disabled:opacity-50">
                    <FiChevronRight />
                </button>
            </div>
            <div className="flex flex-row">
                <div className="w-[118px] h-[36px] animate-pulse rounded bg-gray-200" />
            </div>
        </form>
    );
}
