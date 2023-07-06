import { PropsWithChildren } from "react";
import { PressableProps } from "./types";

interface ButtonProps extends PropsWithChildren, PressableProps {
    icon?: React.ReactNode;
    type?: string;
    danger?: boolean;
    disabled?: boolean;
    groupIndex?: number;
}

export function Button(props: ButtonProps) {
    return <>{props.children}</>;
}
