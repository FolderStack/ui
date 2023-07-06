import { useUser } from "@/hooks";
import { UploadAction } from "../FileUpload";
import { CreateFolderModal } from "../Folder/CreateFolderModal";

export function AdminActions() {
    const user = useUser();
    if (!user?.isAdmin) return null;

    return (
        <>
            <CreateFolderModal />
            <UploadAction />
        </>
    );
}
