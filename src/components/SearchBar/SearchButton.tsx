import { Button, Tooltip } from "antd";
import dynamic from "next/dynamic";

const SearchOutlined = dynamic(
    () => import("@ant-design/icons/SearchOutlined")
);

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
