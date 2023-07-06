"use client";
import { useUpload } from "@/hooks";
import { useMemo } from "react";
import { UploadFileItem } from "./UploadFileItem";

interface UploadFileListProps {
    progress: number[];
}

export function UploadFileList({ progress }: UploadFileListProps) {
    const upload = useUpload();

    const uploadItems = useMemo(() => {
        return upload.files.map((file, idx) => (
            <UploadFileItem
                key={idx}
                file={file}
                progress={progress[idx]}
                onRemove={() => upload.remove(idx)}
            />
        ));
    }, [upload, progress]);

    return (
        <div
            className="space-x-4"
            style={{
                maxHeight: "300px",
                overflowY: "scroll",
                width: "100%",
                paddingTop: "24px",
                paddingBottom: "24px",
            }}
        >
            {uploadItems}
        </div>
    );
}
