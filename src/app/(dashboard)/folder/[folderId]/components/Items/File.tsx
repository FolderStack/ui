"use client";
import { updateFile } from "@/services/db/commands/updateFile";
import { classNames } from "@/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useMemo, useRef, useState, useTransition } from "react";
import { BiSolidFile } from "react-icons/bi";
import { useSWRConfig } from "swr";
import { useDragAndDrop } from "../../../../../../components/Drag/useDragAndDrop";
import { useSelection } from "../../../../../../hooks/SelectContext";
import { useSelectOnControlClick } from "../Select/useOnCtrlSelect";
import { FileMenu } from "./FileMenu";

export function File({ ...item }: any) {
    const session = useSession();
    const isAdmin = session.data?.user?.role === "admin";

    const { mutate } = useSWRConfig();

    const editRef = useRef<HTMLInputElement>(null);
    const [editing, setEditing] = useState(false);
    const [editValue, setEditValue] = useState(item.name);

    const { isBeingDragged, isOver, dragRef } = useDragAndDrop(item);
    const { onClick } = useSelectOnControlClick(item);

    const { isSelected: selectedFn, add, remove } = useSelection();
    const isSelected = useMemo(
        () => selectedFn(item.id),
        [item.id, selectedFn]
    );

    const [imageLoaded, setImageLoaded] = useState(false);
    const [image, setImage] = useState<string | null>(
        `https://cdn.folderstack.io/` + item.s3Key + ".jpg"
    );

    const onImageError = () => {
        console.debug("Image errored, removing it...");
        setImageLoaded(true);
        setImage(null);
    };

    const onImageLoad = () => {
        setImageLoaded(true);
    };

    const [fileMenuOpen, setFileMenuOpen] = useState(false);

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
            await updateFile(String(item.id), { name: editValue });

            mutate(`/api/v1/folders/${String(item.id)}/contents`);
        });
    };

    return (
        <div
            ref={isAdmin ? dragRef : undefined}
            className={classNames(
                isOver || isSelected
                    ? "border-primary-500"
                    : "border-transparent",
                "relative group/file shadow-md h-52 rounded bg-gray-200 cursor-pointer border hover:border-primary-500 hover:shadow-lg min-h-unit-24",
                isOver && !isBeingDragged
                    ? "shadow-xl bg-gray-300"
                    : isBeingDragged
                    ? "opacity-60"
                    : ""
            )}
            onClick={onClick as any}
        >
            <div
                className={classNames(
                    "absolute w-8 h-8 cursor-pointer z-10",
                    isSelected || fileMenuOpen
                        ? "visible"
                        : "invisible group-hover/file:visible"
                )}
                style={{ top: "4px", left: "8px" }}
                onClick={(e) => {
                    e.stopPropagation();
                    isSelected ? remove(item.id) : add(item.id);
                }}
            >
                <input
                    name={`selected[${item.id}]`}
                    type="checkbox"
                    className="cursor-pointer rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                    onClick={(e) => e.stopPropagation()}
                    checked={isSelected}
                    onChange={(v) =>
                        v.target.checked ? add(item.id) : remove(item.id)
                    }
                />
            </div>
            <div
                className={classNames(
                    "absolute cursor-pointer z-10 text-right",
                    isSelected || fileMenuOpen
                        ? "visible"
                        : "invisible group-hover/file:visible"
                )}
                style={{ top: "-4px", right: "0px" }}
            >
                <FileMenu
                    item={item}
                    onOpenState={setFileMenuOpen}
                    toggleEdit={onStartEdit}
                    canEdit={isAdmin}
                />
            </div>
            <div className="p-4 space-y-4 mt-4">
                <div className="w-full relative h-28 overflow-hidden select-none">
                    {image ? (
                        <Image
                            src={image}
                            layout="fill"
                            objectFit="contain"
                            alt="image"
                            onError={onImageError}
                            onLoad={onImageLoad}
                        />
                    ) : (
                        <BiSolidFile
                            style={{ width: "100%", height: "100%" }}
                            className="text-primary-500"
                        />
                    )}
                </div>
                {!editing ? (
                    <div className="text-xs line-clamp-2 text-ellipsis">
                        {editValue}
                    </div>
                ) : (
                    <input
                        className="rounded-sm border-0 text-sm w-full ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600"
                        type="text"
                        value={editValue}
                        onBlur={submitEdit}
                        onSubmit={submitEdit}
                        onKeyDown={(e) => e.code === "Enter" && submitEdit()}
                        onChange={(e) => setEditValue(e.target.value)}
                        ref={editRef}
                    />
                )}
            </div>
        </div>
    );
}
