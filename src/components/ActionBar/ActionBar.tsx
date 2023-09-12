"use client";
import { config } from "@/config";
import { usePageData, useRequestHeaders, useTree, useUser } from "@/hooks";
import { gotoLogin } from "@/utils";
import { Row } from "antd";
import useMessage from "antd/es/message/useMessage";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import { FilterActions } from "../FilterBar/FilterActions";
import { SortActions } from "./SortActions";

export function ActionBar() {
    const user = useUser();
    const { updateItem } = useTree();
    const pageData = usePageData();
    const [messageApi, contextHolder] = useMessage();
    const getHeaders = useRequestHeaders();

    const [name, setName] = useState<string | null>(pageData.name);

    function onChange(value: string) {
        if (value.toLowerCase() === name?.toLowerCase?.()) return;

        const currentFolder = pageData?.data?.data.current?.id;
        if (!currentFolder) return;

        setName(value);
        updateItem(currentFolder, { name: value });

        fetch(`${config.api.baseUrl}/folders/${currentFolder}`, {
            method: "PATCH",
            headers: getHeaders(),
            body: JSON.stringify({ name: value }),
        })
            .then((res) => {
                if (res.status === 401) {
                    gotoLogin();
                }
                if (!res.ok) {
                    messageApi.error("Failed to update folder name");
                }
            })
            .catch(() => {
                messageApi.error("Failed to update folder name");
            });
    }

    useEffect(() => {
        setName(pageData.name);
    }, [pageData.name]);

    return (
        <Row align="middle" justify="space-between">
            {contextHolder}
            <Title
                level={1}
                editable={user?.isAdmin && name ? { onChange } : false}
            >
                {name ?? "Home"}
            </Title>
            <Row align="middle" style={{ marginBottom: "16px", gap: "16px" }}>
                <SortActions />
                <FilterActions />
                {/* <Button.Group>
                    <FilterActions />
                    <DisplayTypeActions />
                </Button.Group> */}
            </Row>
        </Row>
    );
}
