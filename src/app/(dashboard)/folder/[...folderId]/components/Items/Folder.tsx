"use client";
import { classNames } from "@/utils";
import Link from "next/link";
import { useMemo } from "react";
import { BiSolidFolder } from "react-icons/bi";
import { useSelection } from "../Select/SelectContext";

export function Folder({ ...item }: any) {
    const { isSelected: selectedFn, add, remove } = useSelection();

    const isSelected = useMemo(
        () => selectedFn(item.id),
        [item.id, selectedFn]
    );

    return (
        <Link
            prefetch
            href={`/folder/${item.id}`}
            className={classNames(
                "relative group/folder shadow-md h-52 rounded bg-gray-200 cursor-pointer border hover:border-primary-500 hover:shadow-lg min-h-unit-24",
                isSelected ? "border-primary-500" : "border-transparent"
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
        </Link>
    );
}
