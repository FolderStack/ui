import dynamic from "next/dynamic";
import { AntButton, AntProgress, AntRow, AntTooltip } from "../Antd";
import "./upload.css";

const PaperClipOutlined = dynamic(
    () => import("@ant-design/icons/PaperClipOutlined")
);
const DeleteFilled = dynamic(() => import("@ant-design/icons/DeleteFilled"));
const CheckCircleFilled = dynamic(
    () => import("@ant-design/icons/CheckCircleFilled")
);
const CloseCircleFilled = dynamic(
    () => import("@ant-design/icons/CloseCircleFilled")
);

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
            <AntRow
                className="upload-file-item"
                style={{ width: "100%", display: "flex" }}
                justify="space-between"
            >
                <AntRow style={{ gap: "4px" }}>
                    <PaperClipOutlined />
                    {file.name}
                </AntRow>
                {typeof progress !== "number" && (
                    <AntButton
                        className="upload-file-item-delete"
                        icon={<DeleteFilled />}
                        type="text"
                        size="small"
                        onClick={onRemove}
                    />
                )}
                {progress === 100 && (
                    <AntTooltip title="File uploaded">
                        <CheckCircleFilled className="upload-file-item-uploaded" />
                    </AntTooltip>
                )}
                {progress === -1 && (
                    <AntTooltip title="Upload failed">
                        <CloseCircleFilled className="upload-file-item-error" />
                    </AntTooltip>
                )}
            </AntRow>
            {typeof progress === "number" &&
                progress !== 100 &&
                progress !== -1 && (
                    <AntRow>
                        <AntProgress
                            percent={progress}
                            size="small"
                            showInfo={false}
                        />
                    </AntRow>
                )}
        </a>
    );
}
