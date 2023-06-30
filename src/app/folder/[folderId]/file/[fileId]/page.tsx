"use client";
import { DropZone } from "@/components";
import { useFileUpload } from "@/hooks";
import { useParams } from "next/navigation";

export default function FilePage() {
    const params = useParams();
    const onFileDrop = useFileUpload(params.folderId);

    return (
        <DropZone onDrop={onFileDrop}>
            <div>Hi page</div>
        </DropZone>
    );
}
