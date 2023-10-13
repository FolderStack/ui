import { classNames } from "@/utils";
import React, { DetailedHTMLProps, HTMLAttributes } from "react";

interface HeadingProps
    extends DetailedHTMLProps<
        HTMLAttributes<HTMLHeadingElement>,
        HTMLHeadingElement
    > {
    size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function Heading({ children, size = "h1", ...props }: HeadingProps) {
    const classes = [];

    switch (size) {
        case "h1":
            classes.push("font-headings text-4xl");
            break;
        case "h2":
            classes.push("font-headings text-3xl");
            break;
        case "h3":
            classes.push("font-headings text-2xl");
            break;
        case "h4":
            classes.push("font-base text-xl");
            break;
        case "h5":
            classes.push("font-base text-lg");
            break;
        case "h6":
            classes.push("font-base text-base");
            break;
    }

    return React.createElement(
        size,
        { ...props, className: classNames(props.className ?? "", classes) },
        children
    );
}
