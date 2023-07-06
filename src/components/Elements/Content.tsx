import { PropsWithChildren } from "react";
import { DivProps } from "./types";

interface ContentProps extends PropsWithChildren, DivProps {}
{
}

export function Content(props: ContentProps) {
    return <>{props.children}</>;
}
