"use client";
import { DropZone, FolderGrid } from "@/components";
import { FolderList } from "@/components/Folder/FolderList";
import { useDisplayType, usePageData, useUpload } from "@/hooks";
import { useMemo } from "react";

export default function FolderPage() {
    const pageData = usePageData();
    const upload = useUpload();

    const displayType = useDisplayType();

    const content = useMemo(() => {
        if (displayType.type === "list") {
            return <FolderList />;
        }
        return <FolderGrid />;
    }, [displayType]);

    return (
        <DropZone onDrop={upload.openModal}>
            {pageData.isLoading ? <></> : content}
        </DropZone>
    );
}
