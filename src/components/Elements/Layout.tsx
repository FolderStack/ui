import { PropsWithChildren } from "react";
import { DivProps } from "./types";

interface LayoutProps extends PropsWithChildren, DivProps {}

export function Layout(props: LayoutProps) {
    return <>{props.children}</>;
}
