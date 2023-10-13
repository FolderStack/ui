"use client";
import { classNames } from "@/utils";
import { calculatePagination } from "@/utils/calculatePagination";
import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { CurrentQueryVals } from "../CurrentQueryVals";

interface PaginationActionsProps {
    totalItems: number;
    page: number;
    pageSize: number;
}

export function PaginationActions({
    totalItems,
    page,
    pageSize,
}: PaginationActionsProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [currPage, setPage] = useState(page);
    const [currPageSize, setPageSize] = useState(pageSize);

    const maxPages = Math.max(1, Math.floor(totalItems / pageSize));
    const pageNumbers = calculatePagination(page, maxPages);

    function onChange(newVal: number) {
        setPage(Math.min(Math.max(1, newVal), maxPages));
        onSubmit();
    }

    function onChangePageSize(newVal: number) {
        setPageSize(newVal);
        const newMaxPages = Math.max(1, Math.floor(totalItems / newVal));

        if (currPage > newMaxPages) {
            onChange(newMaxPages);
        } else {
            onSubmit();
        }
    }

    function onSubmit() {
        setTimeout(() => {
            if (formRef.current) {
                console.log({ currPage, currPageSize });
                formRef.current.requestSubmit();
            }
        }, 5);
    }

    useEffect(() => {
        if (page > maxPages) {
            onChange(maxPages);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return (
        <form
            method="GET"
            ref={formRef}
            className="flex flex-row space-x-6 ml-auto"
        >
            <CurrentQueryVals exclude={["page", "pageSize"]} />
            <div className="flex flex-row items-center space-x-2 select-none">
                <button
                    disabled={page === 1}
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
                                "rounded bg-gray-200 px-2 border-2 border-solid",
                                pN === currPage
                                    ? "border-primary-500"
                                    : "border-transparent"
                            )}
                        >
                            {pN}
                        </button>
                    ))}
                </div>
                <button
                    disabled={page >= maxPages}
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
                            "relative inline-flex items-center rounded-l px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10",
                            pageSize === 10 ? "bg-gray-300" : "bg-white"
                        )}
                    >
                        10
                    </button>
                    <button
                        type="button"
                        onClick={() => onChangePageSize(20)}
                        className={classNames(
                            "relative -ml-px inline-flex items-center  px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10",
                            pageSize === 20 ? "bg-gray-300" : "bg-white"
                        )}
                    >
                        20
                    </button>
                    <button
                        type="button"
                        onClick={() => onChangePageSize(50)}
                        className={classNames(
                            "relative -ml-px inline-flex items-center rounded-r px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10",
                            pageSize === 50 ? "bg-gray-300" : "bg-white"
                        )}
                    >
                        50
                    </button>
                </span>
                <input type="hidden" name="pageSize" value={currPageSize} />
            </div>
        </form>
    );
}
