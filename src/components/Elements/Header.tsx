import { PropsWithChildren } from "react";
import { DivProps } from "./types";

interface HeaderProps extends PropsWithChildren, DivProps {}
{
}

export function Header(props: HeaderProps) {
    return <>{props.children}</>;
}
