import { CSSProperties, PropsWithChildren } from "react";
import { DivProps } from "./types";

interface RowProps extends PropsWithChildren, DivProps {
    justify?: CSSProperties["justifyContent"];
    align?: CSSProperties["alignItems"];
}

export function Row({ children, ...props }: RowProps) {
    return (
        <div {...props} className={`row-auto ${props.className}`}>
            {children}
        </div>
    );
}
