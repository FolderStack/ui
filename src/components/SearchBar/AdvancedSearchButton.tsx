"use client";
import { FunnelPlotOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

export function AdvancedSearch() {
    const router = useRouter();

    function go(e: MouseEvent) {
        e.preventDefault();
        router.push("/search");
    }

    return (
        <Tooltip title="Go to advanced search">
            <Button icon={<FunnelPlotOutlined />} onClick={go} type="ghost" />
        </Tooltip>
    );
}
