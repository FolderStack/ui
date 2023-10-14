import { CreateFolderModal } from "./CreateFolderModal";
import { UploadModal } from "./Upload/UploadModal";

export async function AdminActions() {
    return (
        <div className="flex flex-row space-x-4">
            <CreateFolderModal />
            <UploadModal />
        </div>
    );
}
