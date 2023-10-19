"use client";

import { deleteFile } from "@/services/db/commands/deleteFile";
import { deleteFolder } from "@/services/db/commands/deleteFolder";
import { downloadSelected } from "@/utils/downloadSelected";
import { Menu, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Fragment, useTransition } from "react";
import {
    RiDeleteBin4Line,
    RiEdit2Fill,
    RiFileDownloadLine,
    RiMoreFill,
} from "react-icons/ri";
import { useSWRConfig } from "swr";
import { useSelection } from "../../../../../../hooks/SelectContext";

interface FileMenuProps {
    item: any;
    onOpenState(b: boolean): void;
    toggleEdit(): void;
    canEdit?: boolean;
}

export function FileMenu({
    item,
    onOpenState,
    toggleEdit,
    canEdit = false,
}: FileMenuProps) {
    const { folderId } = useParams();
    const selection = useSelection();
    const { mutate } = useSWRConfig();

    const user = useSession();
    const isAdmin = user.data?.user?.role === "admin";
    const orgId = user.data?.user?.orgId;

    const [pendingDelete, startTransition] = useTransition();
    const [pendingDownload, startDownloadTransition] = useTransition();

    function onDelete() {
        if (!orgId || !isAdmin) return;
        startTransition(async () => {
            if (item.type === "file") {
                await deleteFile(item.id, folderId.toString(), orgId);
            } else if (!item.root) {
                await deleteFolder(item.id);
            }

            selection.remove(item.id);
            mutate(`/api/v1/folders/${folderId ?? "@root"}/contents`);
        });
    }

    function onDownload() {
        startDownloadTransition(async () => {
            await downloadSelected([item.id]);
        });
    }

    return (
        <Menu as="div" onClick={(e) => e.stopPropagation()}>
            {({ open, close }) => {
                setTimeout(() => onOpenState(open), 100);
                return (
                    <>
                        <div>
                            <Menu.Button
                                className="flex flex-row items-center space-x-3 cursor-pointer"
                                onClick={() => onOpenState(true)}
                            >
                                <RiMoreFill className="p-2" size={42} />
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="-mt-2 p-0 absolute right-0 text-left z-10 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {canEdit && (
                                    <>
                                        <Menu.Item>
                                            <div
                                                onClick={toggleEdit}
                                                className="hover:bg-gray-50 font-medium px-2 py-1 text-sm flex flex-row space-x-2 items-center hover:rounded-t-md"
                                            >
                                                <span>
                                                    <RiEdit2Fill />
                                                </span>
                                                <span>Rename</span>
                                            </div>
                                            <hr />
                                        </Menu.Item>
                                    </>
                                )}
                                <Menu.Item>
                                    <div
                                        onClick={onDownload}
                                        className="hover:bg-gray-50 font-medium px-2 py-1 text-sm flex flex-row space-x-2 items-center hover:rounded-t-md"
                                    >
                                        <span>
                                            <RiFileDownloadLine />
                                        </span>
                                        <span>Download</span>
                                    </div>
                                </Menu.Item>
                                <hr />
                                {canEdit && (
                                    <Menu.Item
                                        as="div"
                                        className="bg-red-500 hover:bg-red-400 text-white font-medium px-2 py-1 text-sm rounded-b-md flex flex-row space-x-2 items-center disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={onDelete}
                                        disabled={pendingDelete}
                                    >
                                        <span>
                                            <RiDeleteBin4Line />
                                        </span>
                                        <span>
                                            {pendingDelete
                                                ? "Deleting"
                                                : "Delete"}
                                        </span>
                                    </Menu.Item>
                                )}
                            </Menu.Items>
                        </Transition>
                    </>
                );
            }}
        </Menu>
    );
}
