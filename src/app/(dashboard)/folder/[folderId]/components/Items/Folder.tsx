"use client";
import { moveItems } from "@/services/db/commands/moveItems";
import { IFolder } from "@/services/db/models";
import { classNames } from "@/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useTransition } from "react";
import { BiSolidFolder } from "react-icons/bi";
import { useSelection } from "../Select/SelectContext";
import { useSelectOnControlClick } from "../Select/useOnCtrlSelect";
import { useDragAndDrop } from "./Drag/useDragAndDrop";

interface FolderProps extends IFolder {
    //
}

export function Folder({ ...item }: FolderProps) {
    const router = useRouter();
    const [dropping, startTransition] = useTransition();

    function onDrop(ids: string[]) {
        startTransition(async () => {
            await moveItems(ids, item.id);
            router.refresh();
        });
    }

    const { isBeingDragged, isOver, dragRef, dropRef } = useDragAndDrop(
        item,
        onDrop
    );
    const { onClick } = useSelectOnControlClick(item);

    const { isSelected: selectedFn, add, remove } = useSelection();
    const isSelected = useMemo(
        () => selectedFn(item.id),
        [item.id, selectedFn]
    );

    const ref = (element: HTMLDivElement) => {
        dropRef(element);
        dragRef(element);
    };

    return (
        <Link
            prefetch
            ref={ref as any}
            href={`/folder/${item.id}`}
            onClick={onClick as any}
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
                        isSelected ? remove(item.id) : add(item.id);
                    }}
                >
                    <input
                        type="checkbox"
                        className="cursor-pointer rounded border-gray-300 text-primary-600 focus:ring-primary-600"
                        onClick={(e) => e.stopPropagation()}
                        checked={isSelected}
                        onChange={(v) =>
                            v.target.checked ? add(item.id) : remove(item.id)
                        }
                    />
                </div>
                <div className="p-4 space-y-4 mt-4">
                    <div className="w-full relative h-28 overflow-hidden">
                        <BiSolidFolder
                            style={{ width: "100%", height: "100%" }}
                            className="text-primary-500"
                        />
                    </div>
                    <div className="text-xs line-clamp-2 text-ellipsis">
                        {item.name}
                    </div>
                </div>
            </div>
        </Link>
    );
}
