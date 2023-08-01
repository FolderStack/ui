import { Button, Tooltip } from "antd";
import { AiOutlineSearch } from "react-icons/ai";

interface SearchButtonProps {
    search(): void;
}

export function SearchButton({ search }: SearchButtonProps) {
    return (
        <Tooltip title="Search">
            <Button
                icon={<AiOutlineSearch />}
                onClick={search}
                type="text"
                className="ai-icon"
            />
        </Tooltip>
    );
}
