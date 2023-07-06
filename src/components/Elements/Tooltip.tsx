import { PropsWithChildren } from "react";

interface TooltipProps extends PropsWithChildren {
    content: string;
}

export function Tooltip({ content, children }: TooltipProps) {
    return <>{children}</>;
}
