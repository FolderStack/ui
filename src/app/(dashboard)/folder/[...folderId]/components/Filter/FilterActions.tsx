"use client";
import { DatePicker } from "@/components/DatePicker";
import { useRef } from "react";
import { CurrentQueryVals } from "../CurrentQueryVals";

interface FilterActionProps {
    from?: string;
    to?: string;
    fileTypes?: string[];
}

export function FilterActions({ from, to, fileTypes }: FilterActionProps) {
    const formRef = useRef<HTMLFormElement>(null);

    function onClear() {
        if (formRef.current) {
            formRef.current.reset();
            formRef.current.requestSubmit();
        }
    }

    return (
        <form method="GET" className="flex flex-row space-x-4" ref={formRef}>
            <CurrentQueryVals exclude={["from", "to", "fileTypes"]} />
            <div>
                <label htmlFor="from">Filter from</label>
                <DatePicker
                    name="from"
                    initialValue={
                        from && !Number.isNaN(new Date(from).getTime())
                            ? new Date(from)
                            : undefined
                    }
                />
            </div>
            <div>
                <label htmlFor="to">Filter to</label>
                <DatePicker
                    name="to"
                    initialValue={
                        to && !Number.isNaN(new Date(to).getTime())
                            ? new Date(to)
                            : undefined
                    }
                />
            </div>
            {/* <div>
                <label htmlFor="fileTypes">File Types</label>
                <MultiSelect name="fileTypes" options={OPTIONS} />
            </div> */}
            <div className="flex flex-row h-100 space-x-4">
                <div className="flex flex-col h-full items-end">
                    <button
                        type="submit"
                        className="mt-auto h-[42px] text-white font-medium inline-flex justify-center rounded border border-transparent bg-primary-300 px-4 py-2 hover:opacity-80 focus:outline-none"
                    >
                        Apply Filters
                    </button>
                </div>
                {/* <div className="flex flex-col h-full items-end">
                    <button
                        onClick={onClear}
                        className="mt-auto h-[42px] rounded bg-secondary-600 px-4 py-1 text-sm font-semibold text-white shadow-sm hover:bg-secondary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-600"
                    >
                        Clear
                    </button>
                </div> */}
            </div>
        </form>
    );
}

const OPTIONS = [
    {
        label: "ai",
        value: "ai",
    },
    {
        label: "csv",
        value: "csv",
    },
    {
        label: "gif",
        value: "image/gif",
    },
    {
        label: "jpg",
        value: "image/jpg",
    },
    {
        label: "mov",
        value: "mov",
    },
    {
        label: "mp4",
        value: "mp4",
    },
    {
        label: "pdf",
        value: "pdf",
    },
    {
        label: "png",
        value: "image/png",
    },
    {
        label: "psd",
        value: "psd",
    },
    {
        label: "xlsx",
        value: "xlsx",
    },
    {
        label: "zip",
        value: "zip",
    },
];
