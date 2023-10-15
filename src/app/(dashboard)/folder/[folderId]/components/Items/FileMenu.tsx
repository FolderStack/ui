"use client";

import { deleteFile } from "@/services/db/commands/deleteFile";
import { Menu, Transition } from "@headlessui/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Fragment, useTransition } from "react";
import {
    RiDeleteBin4Line,
    RiFileDownloadLine,
    RiMoreFill,
} from "react-icons/ri";
import { useSelection } from "../Select/SelectContext";

interface FileMenuProps {
    item: any;
    onOpenState(b: boolean): void;
}

export function FileMenu({ item, onOpenState }: FileMenuProps) {
    const { folderId } = useParams();
    const selection = useSelection();
    const user = useSession();
    const isAdmin = user.data?.user?.role === "admin";

    const [pendingDelete, startTransition] = useTransition();

    function onDelete() {
        startTransition(async () => {
            await deleteFile(item.id, folderId.toString());
            selection.remove(item.id);
        });
    }

    return (
        <Menu as="div">
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
                                {/* <Menu.Item
                        as="div"
                        className="hover:bg-gray-100 px-2 py-1 text-sm flex flex-row space-x-2 items-center rounded-t-md"
                    >
                        <span>
                            <RiShareBoxFill />
                        </span>
                        <span>Share</span>
                    </Menu.Item> */}
                                <hr />
                                <Menu.Item>
                                    <Link
                                        href={item.s3Url}
                                        target="_blank"
                                        download
                                        className="hover:bg-gray-50 font-medium px-2 py-1 text-sm flex flex-row space-x-2 items-center hover:rounded-t-md"
                                    >
                                        <span>
                                            <RiFileDownloadLine />
                                        </span>
                                        <span>Download</span>
                                    </Link>
                                </Menu.Item>
                                <hr />
                                {isAdmin && (
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
