"use client";
import { usePageData, useSelection, useUser } from "@/hooks";
import { Button, Checkbox, Row } from "antd";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineDownload } from "react-icons/ai";
import { DeleteSelectedModal } from "./DeleteSelectedModal";

export function SelectActions() {
    const user = useUser();
    const pageData = usePageData();
    const selection = useSelection();
    const children = useMemo(
        () => pageData.data?.data?.items ?? [],
        [pageData]
    );

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

    function downloadSelected() {
        const selectedItems = selection.selected;
        const urls = [];
        for (const item of children) {
            if (selectedItems.includes(item.id) && item.asset) {
                urls.push(item.asset);
            }
        }
    }

    useEffect(() => {
        setIsAllSelected(isAllSelectedInContext);
    }, [isAllSelectedInContext]);

    const selectableItems = useMemo(
        () =>
            children.filter(
                (child: any) => child.type?.toLowerCase?.() === "file"
            ),
        [children]
    );

    useEffect(() => {
        if (pageData.isLoading) {
            selection.clear();
            setIsAllSelected(false);
        }
    }, [pageData]);

    return (
        <Row align="middle" justify="space-between" style={{ width: "100%" }}>
            <Checkbox
                checked={isAllSelected && selectableItems.length > 0}
                onChange={(evt) => selectAll(evt.target.checked)}
                style={{ userSelect: "none" }}
                disabled={!selectableItems.length || pageData.isLoading}
            >
                Select All
            </Checkbox>

            <Row align={"middle"} style={{ gap: "8px" }}>
                <Button
                    disabled={!selection.selected.length}
                    icon={<AiOutlineDownload className="ai-icon" />}
                    onClick={downloadSelected}
                >
                    Download Selected
                </Button>

                {user?.isAdmin && <DeleteSelectedModal />}
            </Row>
        </Row>
    );
}
