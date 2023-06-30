"use client";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

interface SearchButtonProps {
    search(): void;
}

export function SearchButton({ search }: SearchButtonProps) {
    return (
        <Tooltip title="Search">
            <Button icon={<SearchOutlined />} onClick={search} type="ghost" />
        </Tooltip>
    );
}
