import { useSort } from "@/hooks";
import {
    SortAscendingOutlined,
    SortDescendingOutlined,
} from "@ant-design/icons";
import { Button, Row, Select, Tooltip } from "antd";
import { useCallback, useMemo } from "react";

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
            <Tooltip title="Sort by an attribute">
                <Select
                    value={selected as any}
                    placeholder="Sort by"
                    options={SORT_OPTIONS}
                    onChange={onSelectChange}
                    style={{
                        width: "120px",
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                    }}
                />
            </Tooltip>
            <Tooltip title={Options[sort].title}>
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
