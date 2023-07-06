import { PropsWithChildren } from "react";
import { DivProps } from "./types";

interface ButtonGroupProps extends PropsWithChildren, DivProps {}

export function ButtonGroup(props: ButtonGroupProps) {
    return <>{props.children}</>;
}
