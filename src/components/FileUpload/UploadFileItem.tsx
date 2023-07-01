import {
    CheckCircleFilled,
    CloseCircleFilled,
    DeleteFilled,
    PaperClipOutlined,
} from "@ant-design/icons";
import { Button, Progress, Row, Tooltip } from "antd";
import "./upload.css";

interface UploadFileItemProps {
    file: File;
    progress?: number;
    onRemove(): void;
}

export function UploadFileItem({
    file,
    progress,
    onRemove,
}: UploadFileItemProps) {
    return (
        <a>
            <Row
                className="upload-file-item"
                style={{ width: "100%", display: "flex" }}
                justify="space-between"
            >
                <Row style={{ gap: "4px" }}>
                    <PaperClipOutlined />
                    {file.name}
                </Row>
                {typeof progress !== "number" && (
                    <Button
                        className="upload-file-item-delete"
                        icon={<DeleteFilled />}
                        type="text"
                        size="small"
                        onClick={onRemove}
                    />
                )}
                {progress === 100 && (
                    <Tooltip title="File uploaded">
                        <CheckCircleFilled className="upload-file-item-uploaded" />
                    </Tooltip>
                )}
                {progress === -1 && (
                    <Tooltip title="Upload failed">
                        <CloseCircleFilled className="upload-file-item-error" />
                    </Tooltip>
                )}
            </Row>
            {typeof progress === "number" &&
                progress !== 100 &&
                progress !== -1 && (
                    <Row>
                        <Progress
                            percent={progress}
                            size="small"
                            showInfo={false}
                        />
                    </Row>
                )}
        </a>
    );
}
