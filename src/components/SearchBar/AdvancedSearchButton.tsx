"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { AntButton, AntTooltip } from "../Antd";

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
        <AntTooltip title="Go to advanced search">
            <AntButton
                icon={<FunnelPlotOutlined />}
                onClick={go}
                type="ghost"
            />
        </AntTooltip>
    );
}
