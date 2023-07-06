import { PropsWithChildren } from "react";
import { HeadingProps } from "./types";

interface TitleProps extends PropsWithChildren, HeadingProps {
    size?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function Title({ size = "h1", ...props }: TitleProps) {
    if (size === "h1") return <h1 {...props}>{props.children}</h1>;
    if (size === "h2") return <h2 {...props}>{props.children}</h2>;
    if (size === "h3") return <h3 {...props}>{props.children}</h3>;
    if (size === "h4") return <h4 {...props}>{props.children}</h4>;
    if (size === "h5") return <h5 {...props}>{props.children}</h5>;
    if (size === "h6") return <h6 {...props}>{props.children}</h6>;
}
