"use client";
import { useBoolean, usePageData, useUpload } from "@/hooks";
import { Modal } from "antd";
import { useCallback, useMemo, useReducer } from "react";
import { UploadFileList } from "./UploadFileList";

interface UploadModalProps {
    isOpen: boolean;
}

async function wait(ms: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(null);
        }, ms);
    });
}

async function waitRand(max = 300) {
    const rand = Math.random() * max;
    await wait(rand);
}

function reducer(
    state: number[],
    action: ["progress", number, number] | ["clear"]
): number[] {
    const [type, index, value] = action;
    const newState = [...state];

    if (type === "clear") {
        return [];
    }

    if (state.length - 1 < index) {
        newState.push(value);
    } else {
        newState[index] = value;
    }

    return newState;
}

export function UploadModal({ isOpen }: UploadModalProps) {
    const upload = useUpload();
    const pageData = usePageData();
    const [isLoading, loading] = useBoolean(false);

    const folderName = pageData.data?.folder?.name;
    const [progress, update] = useReducer(reducer, []);

    const onOk = useCallback(async () => {
        loading.on();

        // DUMMY LOADING
        // TODO: Implement actual upload & progress
        for (let i = 0; i < upload.files.length; i++) {
            let intervals = [20, 40, 60, 80, 100];
            for (const int of intervals) {
                await waitRand();
                update(["progress", i, int]);
            }
        }

        loading.off();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [upload]);

    function onCancel() {
        update(["clear"]);
        upload.closeModal();
    }

    const title = useMemo(() => {
        if (folderName) {
            return `Upload files to ${folderName}`;
        } else {
            return `Upload files`;
        }
    }, [folderName]);

    return (
        <Modal
            centered
            okText="Upload"
            cancelText="Cancel"
            confirmLoading={isLoading}
            {...{ title, onOk, open: isOpen, onCancel }}
        >
            <UploadFileList progress={progress} />
        </Modal>
    );
}
