"use client";
import { useFilter } from "@/hooks";
import { Button, Tooltip } from "antd";
import { AiOutlineFilter } from "react-icons/ai";

export function FilterActions() {
    const { isVisible, visible } = useFilter();
    const title = isVisible ? "Hide the filter bar" : "Show the filter bar";

    return (
        <Tooltip {...{ title }}>
            <Button
                type={isVisible ? "primary" : "default"}
                icon={<AiOutlineFilter className="ai-icon" />}
                onClick={visible.toggle}
            />
        </Tooltip>
    );
}
