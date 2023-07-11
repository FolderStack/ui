"use client";
import { usePageData, useTree } from "@/hooks";
import { Button, Row } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import { FilterActions } from "../FilterBar/FilterActions";
import { DisplayTypeActions } from "./DisplayTypeActions";
import { SortActions } from "./SortActions";

export function ActionBar() {
    const { updateItem } = useTree();
    const pageData = usePageData();

    const [name, setName] = useState<string | null>(
        pageData?.data?.data?.current?.name ?? null
    );

    function onChange(value: string) {
        if (value.toLowerCase() === name?.toLowerCase?.()) return;

        const currentFolder = pageData.data.data.current?.id;
        if (!currentFolder) return;

        setName(value);
        updateItem(currentFolder, { name: value });

        fetch(`/api/folders/${currentFolder}`, {
            method: "PATCH",
            body: JSON.stringify({ name: value }),
        }).catch(console.warn);
    }

    useEffect(() => {
        if (pageData?.data?.data?.current?.name) {
            setName(pageData?.data?.data?.current?.name);
        }
    }, [pageData]);

    return (
        <Row align="middle" justify="space-between">
            <Title level={1} editable={{ onChange }}>
                {name}
            </Title>
            <Row align="middle" style={{ marginBottom: "16px", gap: "16px" }}>
                <SortActions />
                <Button.Group>
                    <FilterActions />
                    <DisplayTypeActions />
                </Button.Group>
            </Row>
        </Row>
    );
}
