"use client";

import { useSession } from "next-auth/react";
import { CreateFolderModal } from "./CreateFolderModal";
import { UploadModal } from "./Upload/UploadModal";

export function AdminActions() {
    const user = useSession();
    const isAdmin = user.data?.user?.role === "admin";

    if (!isAdmin) return null;

    return (
        <div className="flex flex-row space-x-4">
            <CreateFolderModal />
            <UploadModal />
        </div>
    );
}
