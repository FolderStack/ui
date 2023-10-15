"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

interface FilterActionProps {
    from?: string;
    to?: string;
    fileTypes?: string[];
}

export function FilterActions({ from, to, fileTypes }: FilterActionProps) {
    const router = useRouter();

    const [dateRange, setDateRange] = useState<{
        startDate: string | Date | null;
        endDate: string | Date | null;
    } | null>({
        startDate:
            from && !Number.isNaN(new Date(from).getTime())
                ? new Date(from)
                : null,
        endDate:
            to && !Number.isNaN(new Date(to).getTime()) ? new Date(to) : null,
    });

    const [currFts, setFts] = useState(fileTypes ?? null);

    function apply() {
        const url = new URL(window.location.href);

        if (dateRange) {
            dateRange.startDate &&
                url.searchParams.set(
                    "from",
                    new Date(dateRange.startDate).toISOString()
                );
            dateRange.endDate &&
                url.searchParams.set(
                    "to",
                    new Date(dateRange.endDate).toISOString()
                );
        }

        currFts && url.searchParams.set("fileTypes", currFts.join(","));

        router.replace(url.pathname + url.search);
    }

    function clear() {
        const url = new URL(window.location.href);

        setDateRange(null);
        setFts(null);

        url.searchParams.delete("from");
        url.searchParams.delete("to");
        url.searchParams.delete("fileTypes");

        router.replace(url.pathname + url.search);
    }

    return (
        <div className="flex flex-row space-x-4">
            <div>
                <label htmlFor="from">Select dates</label>
                <Datepicker
                    value={dateRange}
                    onChange={(v) => setDateRange(v)}
                />
            </div>
            {/* <div>
                <label htmlFor="fileTypes">File Types</label>
                <MultiSelect name="fileTypes" options={OPTIONS} />
            </div> */}
            <div className="flex flex-row h-100 space-x-4">
                <div className="flex flex-col h-full items-end">
                    <button
                        onClick={apply}
                        className="mt-auto h-[42px] text-white font-medium inline-flex justify-center rounded border border-transparent bg-primary-300 px-4 py-2 hover:opacity-80 focus:outline-none"
                    >
                        Apply
                    </button>
                </div>
                <div className="flex flex-col h-full items-end">
                    <button
                        onClick={clear}
                        className="mt-auto h-[42px] rounded bg-secondary-600 px-4 py-1 text-sm font-semibold text-white shadow-sm hover:bg-secondary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-600"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
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
