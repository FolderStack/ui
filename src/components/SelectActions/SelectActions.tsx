"use client";
import { usePageData, useSelection, useUser } from "@/hooks";
import { Button, Checkbox, Row } from "antd";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";

const DownloadOutlined = dynamic(
    () => import("@ant-design/icons/DownloadOutlined")
);

export function SelectActions() {
    const user = useUser();
    const { data = {} } = usePageData();
    const selection = useSelection();
    const children = useMemo(() => data?.data?.items ?? [], [data]);

    const [isAllSelected, setIsAllSelected] = useState(false);

    const isAllSelectedInContext = useMemo(() => {
        return children
            .map((item: any) => selection.isSelected(String(item.id)))
            .every((a: boolean) => a);
    }, [selection, children]);

    function selectAll(state: boolean) {
        if (!state) {
            selection.clear();
        } else {
            const ids = children.map((item: any) => String(item.id));
            selection.setState(ids);
        }
    }

    useEffect(() => {
        setIsAllSelected(isAllSelectedInContext);
    }, [isAllSelectedInContext]);

    return (
        <Row align="middle" justify="space-between" style={{ width: "100%" }}>
            <Checkbox
                checked={isAllSelected && children.length}
                onChange={(evt) => selectAll(evt.target.checked)}
                style={{ userSelect: "none" }}
                disabled={!children.length}
            >
                Select All
            </Checkbox>

            <Row align={"middle"} style={{ gap: "8px" }}>
                <Button
                    disabled={!selection.selected.length}
                    icon={<DownloadOutlined />}
                >
                    Download Selected
                </Button>

                {user?.isAdmin && (
                    <Button danger disabled={!selection.selected.length}>
                        Delete Selected
                    </Button>
                )}
            </Row>
        </Row>
    );
}
