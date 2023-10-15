"use client";
import { classNames } from "@/utils";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useSelection } from "../Select/SelectContext";
import { FileMenu } from "./FileMenu";

export function File({ ...item }: any) {
    const { isSelected: selectedFn, add, remove } = useSelection();

    const isSelected = useMemo(
        () => selectedFn(item.id),
        [item.id, selectedFn]
    );

    const [fileMenuOpen, setFileMenuOpen] = useState(false);

    return (
        <div
            className={classNames(
                "relative group/file shadow-md h-52 rounded bg-gray-200 cursor-default border hover:border-primary-500 hover:shadow-lg min-h-unit-24",
                isSelected ? "border-primary-500" : "border-transparent"
            )}
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
                <FileMenu item={item} onOpenState={setFileMenuOpen} />
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
                <div className="text-xs line-clamp-2 text-ellipsis">
                    {item.name}
                </div>
            </div>
        </div>
    );
}
