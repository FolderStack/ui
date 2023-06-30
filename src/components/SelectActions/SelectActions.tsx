import { usePageData, useSelection } from "@/hooks";
import { DownloadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Row } from "antd";
import { useEffect, useMemo, useState } from "react";

export function SelectActions() {
    const { data = {} } = usePageData();
    const selection = useSelection();

    const [isAllSelected, setIsAllSelected] = useState(false);

    const isAllSelectedInContext = useMemo(() => {
        return (data?.children ?? [])
            .map((item: any) => selection.isSelected(String(item.id)))
            .every((a: boolean) => a);
    }, [data, selection]);

    function selectAll(state: boolean) {
        if (!state) {
            selection.clear();
        } else {
            const ids = (data?.children ?? []).map((item: any) =>
                String(item.id)
            );
            selection.setState(ids);
        }
    }

    useEffect(() => {
        setIsAllSelected(isAllSelectedInContext);
    }, [isAllSelectedInContext]);

    return (
        <Row align="middle" justify="space-between" style={{ width: "100%" }}>
            <Checkbox
                checked={isAllSelected}
                onChange={(evt) => selectAll(evt.target.checked)}
                style={{ userSelect: "none" }}
            >
                Select All
            </Checkbox>

            <Button
                disabled={!selection.selected.length}
                icon={<DownloadOutlined />}
            >
                Download Selected
            </Button>
        </Row>
    );
}
