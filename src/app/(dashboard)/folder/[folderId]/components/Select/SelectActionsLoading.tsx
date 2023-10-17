"use client";
import { RiFolderDownloadFill, RiTaskFill } from "react-icons/ri";

export function SelectActionsLoading() {
    return (
        <div className="flex flex-row space-x-4">
            <button
                disabled
                className="transition-all ease-in-out text-white font-medium inline-flex justify-center rounded border border-transparent bg-primary-300 px-4 py-2 hover:opacity-80 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex flex-row items-center space-x-2">
                    <span>
                        <RiTaskFill />
                    </span>
                    <span>Select All</span>
                </div>
            </button>
            <button
                disabled
                className="transition-all ease-in-out text-white font-medium inline-flex justify-center rounded border border-transparent bg-primary-300 px-4 py-2 hover:opacity-80 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex flex-row items-center space-x-2">
                    <span>
                        <RiFolderDownloadFill />
                    </span>
                    <span>Download Selected</span>
                </div>
            </button>
        </div>
    );
}
