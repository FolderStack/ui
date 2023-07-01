import { useSelection, useUser } from "@/hooks";
import { Button } from "antd";
import { UploadAction } from "../FileUpload";
import { CreateFolderModal } from "../Folder/CreateFolderModal";

export function AdminActions() {
    const selection = useSelection();
    const user = useUser();

    if (!user.isAdmin) return null;

    return (
        <>
            <CreateFolderModal />
            <UploadAction />
            <Button danger disabled={!selection.selected.length}>
                Delete Selected
            </Button>
        </>
    );
}
