import { useSelection, useUser } from "@/hooks";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import { Button } from "antd";

export function AdminActions() {
    const selection = useSelection();
    const user = useUser();

    if (!user.isAdmin) return null;

    return (
        <>
            <Button icon={<PlusOutlined />}>New Folder</Button>
            <Button icon={<UploadOutlined />}>Upload Files</Button>
            <Button danger disabled={!selection.selected.length}>
                Delete Selected
            </Button>
        </>
    );
}
