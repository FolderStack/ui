import { useDisplayType } from "@/hooks";
import dynamic from "next/dynamic";
import { Button } from "../Elements";

const AppstoreOutlined = dynamic(
    () => import("@ant-design/icons/AppstoreOutlined")
);
const UnorderedListOutlined = dynamic(
    () => import("@ant-design/icons/UnorderedListOutlined")
);

export function DisplayTypeActions() {
    const dt = useDisplayType();

    return (
        <>
            {/* <AntTooltip title="Display results in a grid"> */}
            <Button
                type={dt.type === "grid" ? "primary" : "default"}
                icon={<AppstoreOutlined />}
                onClick={() => dt.change("grid")}
            />
            {/* </AntTooltip> */}
            {/* <AntTooltip title="Display results in a table"> */}
            <Button
                type={dt.type === "list" ? "primary" : "default"}
                icon={<UnorderedListOutlined />}
                onClick={() => dt.change("list")}
            />
            {/* </AntTooltip> */}
        </>
    );
}
