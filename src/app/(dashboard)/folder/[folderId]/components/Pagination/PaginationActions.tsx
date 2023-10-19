"use client";
import { classNames } from "@/utils";
import { calculatePagination } from "@/utils/calculatePagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useSelection } from "../../../../../../hooks/SelectContext";

interface PaginationActionsProps {
    totalItems: number;
    page: number;
    pageSize: number;
}

export function PaginationActions({ totalItems }: PaginationActionsProps) {
    const router = useRouter();
    const search = useSearchParams();

    let initialPage = search.get("page") ?? 1;
    initialPage = !Number.isNaN(Number(initialPage)) ? Number(initialPage) : 1;

    let initialPageSize = search.get("pageSize") ?? 20;
    initialPageSize = !Number.isNaN(Number(initialPageSize))
        ? Number(initialPageSize)
        : 20;

    const selection = useSelection();
    const [currPage, setPage] = useState(initialPage);
    const [currPageSize, setPageSize] = useState(initialPageSize);

    const maxPages = useMemo(
        () => Math.max(1, Math.ceil(totalItems / currPageSize)),
        [totalItems, currPageSize]
    );
    const pageNumbers = calculatePagination(currPage, maxPages);

    function onChange(newVal: number, ps = currPageSize) {
        const newPage = Math.min(Math.max(1, newVal), maxPages);
        setPage(newPage);
        onSubmit(newPage, ps);
    }

    function onChangePageSize(newVal: number) {
        setPageSize(newVal);
        const newMaxPages = Math.max(1, Math.floor(totalItems / newVal));

        if (currPage > newMaxPages) {
            onChange(newMaxPages, newVal);
        } else {
            onSubmit(currPage, newVal);
        }
    }

    function onSubmit(newPage: number, newPageSize: number) {
        const url = new URL(window.location.href);
        url.searchParams.set("page", String(newPage));
        url.searchParams.set("pageSize", String(newPageSize));

        selection.setState([]);
        router.push(url.pathname + url.search);
    }

    useEffect(() => {
        if (currPage > maxPages) {
            onChange(maxPages, currPageSize);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currPage, currPageSize]);

    return (
        <div className="flex flex-row space-x-6 ml-auto">
            <div className="flex flex-row items-center space-x-2 select-none">
                <button
                    disabled={currPage === 1}
                    onClick={() => onChange(currPage - 1)}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiChevronLeft />
                </button>
                <div className="flex flex-row items-center space-x-2">
                    {pageNumbers.map((pN, i) => (
                        <button
                            key={i}
                            onClick={() => onChange(pN)}
                            className={classNames(
                                "rounded px-2 border-2 border-solid font-medium ",
                                pN === currPage
                                    ? "border-transparent text-white bg-primary-400 hover:opacity-80"
                                    : "border-primary-400 bg-white hover:opacity-80"
                            )}
                        >
                            {pN}
                        </button>
                    ))}
                </div>
                <button
                    disabled={currPage >= maxPages}
                    onClick={() => onChange(currPage + 1)}
                    className="disabled:opacity-50"
                >
                    <FiChevronRight />
                </button>
                <input type="hidden" name="page" value={currPage} />
            </div>
            <div className="flex flex-row">
                <span className="isolate inline-flex rounded-md shadow-sm">
                    <button
                        type="button"
                        onClick={() => onChangePageSize(10)}
                        className={classNames(
                            "relative inline-flex items-center rounded-l px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:opacity-60 focus:z-10",
                            currPageSize === 10
                                ? "bg-primary-300 text-white"
                                : "bg-white"
                        )}
                    >
                        10
                    </button>
                    <button
                        type="button"
                        onClick={() => onChangePageSize(20)}
                        className={classNames(
                            "relative -ml-px inline-flex items-center  px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:opacity-60 focus:z-10",
                            currPageSize === 20
                                ? "bg-primary-300 text-white"
                                : "bg-white"
                        )}
                    >
                        20
                    </button>
                    <button
                        type="button"
                        onClick={() => onChangePageSize(50)}
                        className={classNames(
                            "relative -ml-px inline-flex items-center rounded-r px-3 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 hover:opacity-60 focus:z-10",
                            currPageSize === 50
                                ? "bg-primary-300 text-white"
                                : "bg-white"
                        )}
                    >
                        50
                    </button>
                </span>
                <input type="hidden" name="pageSize" value={currPageSize} />
            </div>
        </div>
    );
}
