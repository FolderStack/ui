import { useSort } from "@/hooks";
import { Button, Row, Select } from "antd";
import { useCallback, useMemo } from "react";
import {
    AiOutlineSortAscending,
    AiOutlineSortDescending,
} from "react-icons/ai";

const Options: Record<string, any> = {
    desc: {
        title: "Sort descending",
        icon: <AiOutlineSortAscending className="ai-icon" />,
        toggle: "asc",
    },
    asc: {
        title: "Sort ascending",
        icon: <AiOutlineSortDescending className="ai-icon" />,
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
            <Select
                value={selected as any}
                placeholder="Sort by"
                options={SORT_OPTIONS}
                onChange={onSelectChange}
                style={{
                    width: "120px",
                }}
            />

            <Button icon={Options[sort].icon} onClick={onToggle} />
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
        value: "fileSize",
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
