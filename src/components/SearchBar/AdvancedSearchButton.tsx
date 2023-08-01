"use client";
import { Button, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { AiOutlineFunnelPlot } from "react-icons/ai";

export function AdvancedSearch() {
    const router = useRouter();

    function go(e: MouseEvent) {
        e.preventDefault();
        router.push("/search");
    }

    return (
        <Tooltip title="Go to advanced search">
            <Button
                icon={<AiOutlineFunnelPlot />}
                onClick={go}
                type="text"
                className="ai-icon"
            />
        </Tooltip>
    );
}
