"use client";
import { deleteFile } from "@/services/db/commands/deleteFile";
import { deleteFolder } from "@/services/db/commands/deleteFolder";
import { classNames } from "@/utils";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import {
    RiCloseFill,
    RiDeleteBin4Fill,
    RiFolderDownloadFill,
    RiTaskFill,
} from "react-icons/ri";
import { useSelection } from "./SelectContext";

interface SelectActionsProps {
    items: any[];
}

export function SelectActions({ items = [] }: SelectActionsProps) {
    const user = useSession();
    const isAdmin = user.data?.user?.role === "admin";

    const { folderId } = useParams();
    const selection = useSelection();
    const [pendingDelete, startTransition] = useTransition();

    const allSelected =
        selection.selected.length === items.length && items.length > 0;

    const selectAll = () => {
        if (allSelected) {
            selection.setState([]);
        } else {
            selection.setState(items.map((i) => i.id));
        }
    };

    const deleteSelected = () => {
        startTransition(async () => {
            const result = await Promise.allSettled(
                selection.selected.map(async (id) => {
                    const item = items.find((i) => i.id === id);
                    if (item) {
                        if (item.type === "file") {
                            await deleteFile(id, folderId.toString());
                        } else {
                            await deleteFolder(id);
                        }
                    }
                })
            );

            const remainingSelection = result
                .map((res, idx) => {
                    if (res.status === "fulfilled") {
                        return null;
                    }
                    return selection.selected[idx];
                })
                .filter((v) => v !== null) as string[];

            selection.setState(remainingSelection);
        });
    };

    return (
        <div className="flex flex-row space-x-4">
            <button
                onClick={selectAll}
                disabled={!items.length}
                className="transition-all ease-in-out text-white font-medium inline-flex justify-center rounded border border-transparent bg-primary-300 px-4 py-2 hover:opacity-80 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex flex-row items-center space-x-2">
                    <span>
                        {allSelected ? <RiCloseFill /> : <RiTaskFill />}
                    </span>
                    <span>{allSelected ? "Deselect All" : "Select All"}</span>
                </div>
            </button>
            <button
                disabled={!selection.selected.length}
                className="transition-all ease-in-out text-white font-medium inline-flex justify-center rounded border border-transparent bg-primary-300 px-4 py-2 hover:opacity-80 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <div className="flex flex-row items-center space-x-2">
                    <span>
                        <RiFolderDownloadFill />
                    </span>
                    <span>Download Selected</span>
                </div>
            </button>
            {isAdmin && (
                <button
                    disabled={!selection.selected.length || pendingDelete}
                    className={classNames(
                        "transition-all ease-in-out text-white font-medium inline-flex justify-center rounded border border-transparent bg-red-600 px-4 py-2 hover:opacity-80 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                    onClick={deleteSelected}
                >
                    <div className="flex flex-row items-center space-x-2">
                        <span>
                            <RiDeleteBin4Fill />
                        </span>
                        <span>
                            {pendingDelete ? "Deleting" : "Delete Selected"}
                        </span>
                    </div>
                </button>
            )}
        </div>
    );
}
