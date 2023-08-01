"use client";
import { useUpload } from "@/hooks";
import { Button } from "antd";
import Upload from "antd/es/upload/Upload";
import { AiOutlineUpload } from "react-icons/ai";

export function UploadAction() {
    const upload = useUpload();

    return (
        <Upload
            multiple
            showUploadList={false}
            beforeUpload={(_, files) => {
                upload.openModal(files);
                return false;
            }}
        >
            <Button icon={<AiOutlineUpload className="ai-icon" />}>
                Upload Files
            </Button>
        </Upload>
    );
}
