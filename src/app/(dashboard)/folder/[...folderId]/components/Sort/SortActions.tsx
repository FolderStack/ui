"use client";

import { Button } from "@/components/Button";
import { useRef, useState } from "react";
import {
    AiOutlineSortAscending,
    AiOutlineSortDescending,
} from "react-icons/ai";
import { CurrentQueryVals } from "../CurrentQueryVals";

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
    const form = useRef<HTMLFormElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [currentSort, setSort] = useState(sort);

    function changeSort() {
        if (currentSort === "asc") {
            setSort("desc");
        } else {
            setSort("asc");
        }
        onSubmit();
    }

    function onSubmit(e?: any) {
        if (buttonRef.current) {
            buttonRef.current.click();
        }
    }

    return (
        <form method="GET" className="flex flex-row space-x-2">
            <CurrentQueryVals exclude={["sort", "sortBy"]} />
            <select
                name="sortBy"
                defaultValue={sortBy}
                onChange={onSubmit}
                className="mt-2 block w-36 rounded border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 sm:text-sm sm:leading-6 cursor-pointer"
            >
                <option value="name">Name</option>
                <option value="fileSize">Size</option>
                <option value="createdAt">Uploaded</option>
                <option value="updatedAt">Updated</option>
            </select>
            <input type="hidden" name="sort" value={currentSort} />
            <Button
                icon={Options[currentSort].icon}
                onClick={changeSort}
                className="mt-2 px-2.5 rounded border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 hover:bg-primary-200 transition-all ease-in-out"
            />
            <button
                type="submit"
                ref={buttonRef}
                className="hidden appearance-none"
            />
        </form>
    );
}
