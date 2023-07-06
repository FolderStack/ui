"use client";
import { randomBytes } from "crypto";
import { PropsWithChildren, useState } from "react";

interface TooltipProps extends PropsWithChildren {
    content: string;
}

function getId() {
    return "tooltip-" + randomBytes(8).toString("base64");
}

export function Tooltip({ content, children }: TooltipProps) {
    const [id] = useState(getId());
    return (
        <>
            <div
                data-tooltip-target={id}
                data-tooltip-trigger="hover"
                className="text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
                {children}
            </div>
            <div
                id={id}
                role="tooltip"
                className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
            >
                {content}
                <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
        </>
    );
}
