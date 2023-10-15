"use client";

import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    AiOutlineSortAscending,
    AiOutlineSortDescending,
} from "react-icons/ai";

interface SortActionsProps {
    sort: string;
    sortBy: string;
}

const Options: Record<string, any> = {
    desc: {
        title: "Sort descending",
        icon: <AiOutlineSortAscending />,
        toggle: "asc",
    },
    asc: {
        title: "Sort ascending",
        icon: <AiOutlineSortDescending />,
        toggle: "desc",
    },
};

export function SortActions({ sort, sortBy }: SortActionsProps) {
    const router = useRouter();

    const [currSortBy, setSortBy] = useState(sortBy);
    const [currSort, setSort] = useState(sort);

    function onSubmit(newSortBy: string, newSort: string) {
        setSortBy(newSortBy);
        setSort(newSort);

        const url = new URL(window.location.href);
        url.searchParams.set("sort", newSort);
        url.searchParams.set("sortBy", newSortBy);

        router.replace(url.pathname + url.search);
    }

    return (
        <div className="flex flex-row space-x-2">
            <select
                name="sortBy"
                value={sortBy}
                onChange={(v) => {
                    onSubmit(v.target.value, currSort);
                }}
                className="mt-2 block w-36 rounded border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 cursor-pointer"
            >
                <option value="name">Name</option>
                <option value="fileSize">Size</option>
                <option value="createdAt">Uploaded</option>
                <option value="updatedAt">Updated</option>
            </select>
            <Button
                icon={Options[currSort].icon}
                onClick={() => {
                    const newVal = currSort === "asc" ? "desc" : "asc";
                    onSubmit(currSortBy, newVal);
                }}
                className="mt-2 px-2.5 rounded border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 hover:bg-primary-400 hover:text-white hover:ring-primary-400 transition-all ease-in-out"
            />
        </div>
    );
}
