"use client";
import { Button, Tooltip } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";

const FunnelPlotOutlined = dynamic(
    () => import("@ant-design/icons/FunnelPlotOutlined")
);

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
