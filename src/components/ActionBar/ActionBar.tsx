"use client";
import { usePageData, useTree, useUser } from "@/hooks";
import { gotoLogin } from "@/utils";
import { Button, Row } from "antd";
import useMessage from "antd/es/message/useMessage";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import { FilterActions } from "../FilterBar/FilterActions";
import { DisplayTypeActions } from "./DisplayTypeActions";
import { SortActions } from "./SortActions";

export function ActionBar() {
    const user = useUser();
    const { updateItem } = useTree();
    const pageData = usePageData();
    const [messageApi, contextHolder] = useMessage();

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
        setName(pageData?.data?.data?.current?.name ?? null);
    }, [pageData]);

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
                <Button.Group>
                    <FilterActions />
                    <DisplayTypeActions />
                </Button.Group>
            </Row>
        </Row>
    );
}
