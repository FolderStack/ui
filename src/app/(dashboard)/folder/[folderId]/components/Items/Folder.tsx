"use client";
import { useMoveOnDrop } from "@/hooks/useMoveOnDrop";
import { updateFolder } from "@/services/db/commands/updateFolder";
import { IFileSystemObject } from "@/services/db/models";
import { classNames } from "@/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, useTransition } from "react";
import { BiSolidFolder } from "react-icons/bi";
import { useSWRConfig } from "swr";
import { useDragAndDrop } from "../../../../../../components/Drag/useDragAndDrop";
import { useSelection } from "../../../../../../hooks/SelectContext";
import { useSelectOnControlClick } from "../Select/useOnCtrlSelect";
import { FileMenu } from "./FileMenu";

interface FolderProps extends IFileSystemObject {
    //
}

export function Folder({ ...item }: FolderProps) {
    const session = useSession();
    const isAdmin = session.data?.user?.role === "admin";

    const { mutate } = useSWRConfig();

    const editRef = useRef<HTMLInputElement>(null);
    const [editing, setEditing] = useState(false);
    const [editValue, setEditValue] = useState(item.name);

    const { onDrop } = useMoveOnDrop(String(item.id));
    const { isBeingDragged, isOver, dragRef, dropRef } = useDragAndDrop(
        item,
        onDrop
    );

    const { onClick } = useSelectOnControlClick(item);

    const { isSelected: selectedFn, add, remove } = useSelection();
    const isSelected = useMemo(
        () => selectedFn(String(item.id)),
        [item.id, selectedFn]
    );

    const [fileMenuOpen, setFileMenuOpen] = useState(false);

    const ref = (element: HTMLDivElement) => {
        dropRef(element);
        dragRef(element);
    };

    const router = useRouter();
    const prefetch = () => {
        router.prefetch(`/folder/${item.id}`);
    };

    const onFolderClick = (e: any) => {
        if (!onClick(e)) {
            router.push(`/folder/${item.id}`);
        }
    };

    const onStartEdit = () => {
        setEditing(true);
        setTimeout(() => {
            if (editRef.current) {
                editRef.current.focus();
                editRef.current.select();
            }
        }, 100);
    };

    const [editPending, startTransition] = useTransition();
    const submitEdit = () => {
        setEditing(false);
        startTransition(async () => {
            await updateFolder(String(item.id), { name: editValue });

            mutate(`/api/v1/tree`);
            mutate(`/api/v1/folders/${String(item.id)}`);
            mutate(`/api/v1/folders/${String(item.id)}/contents`);
        });
    };

    return (
        <div
            ref={isAdmin ? (ref as any) : undefined}
            onClick={onFolderClick}
            onMouseEnter={prefetch}
            className={isBeingDragged ? "opacity-60" : ""}
        >
            <div
                className={classNames(
                    isOver || isSelected
                        ? "border-primary-500"
                        : "border-transparent",
                    "relative group/folder shadow-md h-52 rounded bg-gray-200 cursor-pointer border hover:border-primary-500 hover:shadow-lg min-h-unit-24",
                    isOver && !isBeingDragged ? "shadow-xl bg-gray-300" : ""
                )}
            >
                <div
                    className={classNames(
                        "absolute w-8 h-8 cursor-pointer z-10",
                        isSelected
                            ? "visible"
                            : "invisible group-hover/folder:visible"
                    )}
                    style={{ top: "4px", left: "8px" }}
                    onClick={(e) => {
                        e.stopPropagation();
                        isSelected
                            ? remove(String(item.id))
                            : add(String(item.id));
                    }}
                >
                    <input
                        type="checkbox"
                        className="cursor-pointer rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                        onClick={(e) => e.stopPropagation()}
                        checked={isSelected}
                        onChange={(v) =>
                            v.target.checked
                                ? add(String(item.id))
                                : remove(String(item.id))
                        }
                    />
                </div>
                <div
                    className={classNames(
                        "absolute cursor-pointer z-50 text-right",
                        isSelected || fileMenuOpen
                            ? "visible"
                            : "invisible group-hover/folder:visible"
                    )}
                    style={{ top: "-4px", right: "0px" }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <FileMenu
                        item={item}
                        onOpenState={setFileMenuOpen}
                        toggleEdit={onStartEdit}
                        canEdit={isAdmin}
                    />
                </div>
                <div className="p-4 space-y-4 mt-4">
                    <div className="w-full relative h-28 overflow-hidden">
                        <BiSolidFolder
                            style={{ width: "100%", height: "100%" }}
                            className="text-primary-500"
                        />
                    </div>

                    {!editing ? (
                        <div className="text-xs line-clamp-2 text-ellipsis">
                            {editValue}
                        </div>
                    ) : (
                        <input
                            className="text-sm"
                            type="text"
                            value={editValue}
                            onBlur={submitEdit}
                            onSubmit={submitEdit}
                            onKeyDown={(e) =>
                                e.code === "Enter" && submitEdit()
                            }
                            onChange={(e) => setEditValue(e.target.value)}
                            ref={editRef}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
