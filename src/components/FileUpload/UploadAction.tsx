"use client";
import { useUpload } from "@/hooks";
import { Button } from "antd";
import Upload from "antd/es/upload/Upload";
import dynamic from "next/dynamic";

const UploadOutlined = dynamic(
    () => import("@ant-design/icons/UploadOutlined")
);

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
            <Button icon={<UploadOutlined />}>Upload Files</Button>
        </Upload>
    );
}
