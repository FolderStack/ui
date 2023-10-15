import { formatFileSize } from "@/utils/formatFileSize";
import { CircularProgress, Tooltip } from "@nextui-org/react";
import { useState } from "react";
import { BsCheckCircleFill, BsFillExclamationCircleFill } from "react-icons/bs";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { ProgressError, ProgressState } from "./progressReducer";

interface UploadRowProps {
    file: File;
    progress: ProgressState | ProgressError;
    onRemove(): void;
}

const AlertPing = () => (
    <span
        className="animate-ping absolute h-3 w-3 rounded-full bg-red-500 opacity-75"
        style={{
            right: "2px",
            top: "2px",
        }}
    ></span>
);

export function UploadRow({
    file,
    progress: uploadProgress,
    onRemove,
}: UploadRowProps) {
    // Hide the AlertPing once hovered, makes the UI less jarring.
    const [hovered, setHovered] = useState(false);

    const { progress = 0 } = uploadProgress ?? {};
    const progressColor = progress === 100 ? "success" : "default";

    return (
        <div className="flex flex-row w-full justify-between transition-all ease-in-out ">
            <div className="w-[60%] truncate">{file.name}</div>
            <div className="flex flex-row space-x-2 items-center">
                {progress !== null && progress > 0 && progress < 100 && (
                    <CircularProgress
                        aria-label="Uploading..."
                        classNames={{
                            svg: "w-4 h-4",
                        }}
                        isIndeterminate={progress === 99}
                        value={progress === 99 ? undefined : progress}
                        color={progressColor}
                    />
                )}
                {progress === -1 && (
                    <Tooltip
                        showArrow={true}
                        radius="sm"
                        content={
                            <div className="px-1 py-2">
                                <div className="text-small font-bold">
                                    Failed to upload
                                </div>
                                <div className="text-tiny">
                                    {"error" in uploadProgress &&
                                        uploadProgress.error}
                                </div>
                            </div>
                        }
                    >
                        <button
                            className="text-red-500 relative"
                            onMouseEnter={() => setHovered(true)}
                        >
                            {!hovered && <AlertPing />}
                            <BsFillExclamationCircleFill className="z-10" />
                        </button>
                    </Tooltip>
                )}
                <span>{formatFileSize(file.size)}</span>
                {progress !== null && progress <= 0 && (
                    <span
                        className="cursor-pointer hover:text-red-500"
                        role="button"
                        onClick={onRemove}
                    >
                        <RiDeleteBin5Fill />
                    </span>
                )}
                {progress === 100 && (
                    <BsCheckCircleFill className="text-green-500" />
                )}
            </div>
        </div>
    );
}
