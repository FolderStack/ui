import { Button, Progress, Row, Tooltip } from "antd";
import {
    AiFillCheckCircle,
    AiFillCloseCircle,
    AiFillDelete,
    AiOutlinePaperClip,
} from "react-icons/ai";
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
                    <AiOutlinePaperClip className="ai-icon" />
                    {file.name}
                </Row>
                {typeof progress !== "number" && (
                    <Button
                        className="upload-file-item-delete"
                        icon={<AiFillDelete className="ai-icon" />}
                        type="text"
                        size="small"
                        onClick={onRemove}
                    />
                )}
                {progress === 100 && (
                    <Tooltip title="File uploaded">
                        <AiFillCheckCircle className="upload-file-item-uploaded ai-icon" />
                    </Tooltip>
                )}
                {progress === -1 && (
                    <Tooltip title="Upload failed">
                        <AiFillCloseCircle className="upload-file-item-error ai-icon" />
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
