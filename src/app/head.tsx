import { useOrg } from "@/hooks";
import { useMemo } from "react";

export function Head() {
    const org = useOrg();
    const icon = useMemo(() => org.config?.favicon, [org]);

    return (
        <head>
            <title>Loading</title>
            <link rel="icon" href={icon} sizes="any" />
        </head>
    );
}
