import { useSort } from "@/hooks";
import dynamic from "next/dynamic";
import { useCallback, useMemo } from "react";
import { Button, Row } from "../Elements";
import { Tooltip } from "../Elements/Tooltip";

const SortAscendingOutlined = dynamic(
    () => import("@ant-design/icons/SortAscendingOutlined")
);
const SortDescendingOutlined = dynamic(
    () => import("@ant-design/icons/SortAscendingOutlined")
);

const Options: Record<string, any> = {
    desc: {
        title: "Sort descending",
        icon: <SortAscendingOutlined />,
        toggle: "asc",
    },
    asc: {
        title: "Sort ascending",
        icon: <SortDescendingOutlined />,
        toggle: "desc",
    },
};

export function SortActions() {
    const { sort, sortBy, change } = useSort();

    const onSelectChange = useCallback((val: string) => change(val), [change]);
    const onToggle = useCallback(() => {
        change(sortBy, sort === "asc" ? "desc" : "asc");
    }, [sortBy, sort, change]);

    const selected = useMemo(() => {
        if (sortBy) {
            return SORT_OPTIONS.find(
                (o) => o.value.toLowerCase() === sortBy.toLowerCase()
            );
        }
        return null;
    }, [sortBy]);

    return (
        <Row align="middle" style={{ gap: "4px" }}>
            <Tooltip content="Sort by an attribute">
                {/* <AntSelect
                    value={selected as any}
                    placeholder="Sort by"
                    options={SORT_OPTIONS}
                    onChange={onSelectChange as any}
                    style={{
                        width: "120px",
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                    }}
                /> */}
            </Tooltip>
            <Tooltip content={Options[sort].title}>
                <Button icon={Options[sort].icon} onClick={onToggle} />
            </Tooltip>
        </Row>
    );
}

const SORT_OPTIONS = [
    {
        label: "Name",
        value: "name",
    },
    {
        label: "Size",
        value: "size",
    },
    {
        label: "Uploaded",
        value: "createdAt",
    },
    {
        label: "Updated",
        value: "updatedAt",
    },
];
