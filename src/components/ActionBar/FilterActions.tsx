import { useFilter } from "@/hooks";
import dynamic from "next/dynamic";
import { Button } from "../Elements";

const FilterOutlined = dynamic(
    () => import("@ant-design/icons/FilterOutlined")
);

export function FilterActions() {
    const { isVisible, visible } = useFilter();
    const title = isVisible ? "Hide the filter bar" : "Show the filter bar";

    return (
        // <AntTooltip {...{ title }}>
        <Button
            type={isVisible ? "primary" : "default"}
            icon={<FilterOutlined />}
            onClick={visible.toggle}
        />
        // </AntTooltip>
    );
}
