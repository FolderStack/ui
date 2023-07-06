import dynamic from "next/dynamic";
import { AntButton, AntTooltip } from "../Antd";

const SearchOutlined = dynamic(
    () => import("@ant-design/icons/SearchOutlined")
);

interface SearchButtonProps {
    search(): void;
}

export function SearchButton({ search }: SearchButtonProps) {
    return (
        <AntTooltip title="Search">
            <AntButton
                icon={<SearchOutlined />}
                onClick={search}
                type="ghost"
            />
        </AntTooltip>
    );
}
