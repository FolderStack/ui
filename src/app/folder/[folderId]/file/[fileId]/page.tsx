"use client";
import { DropZone } from "@/components";
import { useUpload } from "@/hooks";

export default function FilePage() {
    const upload = useUpload();

    return (
        <DropZone onDrop={upload.openModal}>
            <div>Hi page</div>
        </DropZone>
    );
}
