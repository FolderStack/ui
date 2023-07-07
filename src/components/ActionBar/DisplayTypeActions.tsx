import { useDisplayType } from "@/hooks";
import { AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Button, Tooltip } from "antd";

export function DisplayTypeActions() {
    const dt = useDisplayType();

    return (
        <>
            <Tooltip title="Display results in a grid">
                <Button
                    type={dt.type === "grid" ? "primary" : "default"}
                    icon={<AppstoreOutlined />}
                    onClick={() => dt.change("grid")}
                />
            </Tooltip>
            <Tooltip title="Display results in a table">
                <Button
                    type={dt.type === "list" ? "primary" : "default"}
                    icon={<UnorderedListOutlined />}
                    onClick={() => dt.change("list")}
                />
            </Tooltip>
        </>
    );
}
