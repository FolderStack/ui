"use client";
import { updateFile } from "@/services/db/commands/updateFile";
import { classNames } from "@/utils";
import Image from "next/image";
import { useMemo, useRef, useState, useTransition } from "react";
import { useSWRConfig } from "swr";
import { useDragAndDrop } from "../../../../../../components/Drag/useDragAndDrop";
import { useSelection } from "../../../../../../hooks/SelectContext";
import { useSelectOnControlClick } from "../Select/useOnCtrlSelect";
import { FileMenu } from "./FileMenu";

export function File({ ...item }: any) {
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
            ref={dragRef}
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
                />
            </div>
            <div className="p-4 space-y-4 mt-4">
                <div className="w-full relative h-28 overflow-hidden select-none">
                    <Image
                        src={
                            "https://via.placeholder.com/300x300.png?text=Missing+Thumbail"
                        }
                        layout="fill"
                        objectFit="contain"
                        alt="image"
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
                        onKeyDown={(e) => e.code === "Enter" && submitEdit()}
                        onChange={(e) => setEditValue(e.target.value)}
                        ref={editRef}
                    />
                )}
            </div>
        </div>
    );
}
