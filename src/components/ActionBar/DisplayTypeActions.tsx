import { useDisplayType } from "@/hooks";
import { Button, Tooltip } from "antd";
import { AiOutlineAppstore, AiOutlineUnorderedList } from "react-icons/ai";

export function DisplayTypeActions() {
    const dt = useDisplayType();

    return (
        <>
            <Tooltip title="Display results in a grid">
                <Button
                    type={dt.type === "grid" ? "primary" : "default"}
                    icon={<AiOutlineAppstore className="ai-icon" />}
                    onClick={() => dt.change("grid")}
                />
            </Tooltip>
            <Tooltip title="Display results in a table">
                <Button
                    type={dt.type === "list" ? "primary" : "default"}
                    icon={<AiOutlineUnorderedList className="ai-icon" />}
                    onClick={() => dt.change("list")}
                />
            </Tooltip>
        </>
    );
}
