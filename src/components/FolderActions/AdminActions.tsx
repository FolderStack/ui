import { useUser } from "@/hooks";
import { Row } from "antd";
import { UploadAction } from "../FileUpload";
import { CreateFolderModal } from "../Folder/CreateFolderModal";
import { DeleteFolderModal } from "../Folder/DeleteFolderModal";

export function AdminActions() {
    const user = useUser();
    if (!user?.isAdmin) return null;

    return (
        <Row align="middle" style={{ gap: "8px" }}>
            <UploadAction />
            <CreateFolderModal />
            <DeleteFolderModal />
        </Row>
    );
}
