"use client";
import { useUpload } from "@/hooks";
import dynamic from "next/dynamic";
import { Button } from "../Elements";

const UploadOutlined = dynamic(
    () => import("@ant-design/icons/UploadOutlined")
);

export function UploadAction() {
    const upload = useUpload();

    return <Button icon={<UploadOutlined />}>Upload Files</Button>;

    // return (
    //     <AntUpload
    //         multiple
    //         showUploadList={false}
    //         beforeUpload={(_, files) => {
    //             upload.openModal(files);
    //             return false;
    //         }}
    //     >
    //         <AntButton icon={<UploadOutlined />}>Upload Files</AntButton>
    //     </AntUpload>
    // );
}
