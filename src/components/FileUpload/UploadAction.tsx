import { useUpload } from "@/hooks";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";

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
