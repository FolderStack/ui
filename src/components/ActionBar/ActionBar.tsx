"use client";
import { usePageData } from "@/hooks";
import { Row } from "antd";
import ButtonGroup from "antd/es/button/button-group";
import Title from "antd/es/typography/Title";
import { DisplayTypeActions } from "./DisplayTypeActions";
import { FilterActions } from "./FilterActions";
import { SortActions } from "./SortActions";

export function ActionBar() {
    const pageData = usePageData();
    const folderName = pageData.data?.folder?.name;

    return (
        <Row align="middle" justify="space-between">
            <Title level={1}>{folderName}</Title>
            <Row align="middle" style={{ marginBottom: "16px", gap: "16px" }}>
                <SortActions />
                <ButtonGroup>
                    <FilterActions />
                    <DisplayTypeActions />
                </ButtonGroup>
            </Row>
        </Row>
    );
}
