"use client";
import { useFilter } from "@/hooks";
import { FilterOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

export function FilterActions() {
    const { isVisible, visible } = useFilter();
    const title = isVisible ? "Hide the filter bar" : "Show the filter bar";

    return (
        <Tooltip {...{ title }}>
            <Button
                type={isVisible ? "primary" : "default"}
                icon={<FilterOutlined />}
                onClick={visible.toggle}
            />
        </Tooltip>
    );
}
