import { CSSProperties, PropsWithChildren } from "react";
import { DivProps } from "./types";

interface ColProps extends PropsWithChildren, DivProps {
    justify?: CSSProperties["justifyContent"];
    align?: CSSProperties["alignItems"];
}

export function Col({ children, ...props }: ColProps) {
    return (
        <div {...props} className={`col-auto ${props.className}`}>
            {children}
        </div>
    );
}
