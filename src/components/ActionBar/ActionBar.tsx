"use client";
import { usePageData } from "@/hooks";
import { Button, Row } from "antd";
import Title from "antd/es/typography/Title";
import { useMemo } from "react";
import { FilterActions } from "../FilterBar/FilterActions";
import { DisplayTypeActions } from "./DisplayTypeActions";
import { SortActions } from "./SortActions";

export function ActionBar() {
    const pageData = usePageData();
    const name = useMemo(
        () => pageData?.data?.data?.current?.name ?? "",
        [pageData]
    );

    return (
        <Row align="middle" justify="space-between">
            <Title level={1}>{name}</Title>
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
