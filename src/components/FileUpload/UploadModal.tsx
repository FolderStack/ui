"use client";
import { useBoolean, usePageData, useUpload } from "@/hooks";
import { gotoLogin } from "@/utils";
import { Modal } from "antd";
import axios from "axios";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
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
    const [isFetchingUrls, fetching] = useBoolean(false);
    const [isLoading, loading] = useBoolean(false);

    const [urls, setUrls] = useState<Record<string, string>>({});

    const folderName = pageData.data?.data?.current?.name;
    const folderId = pageData.data?.data?.current?.id;

    const [progress, update] = useReducer(reducer, []);

    async function notifyUpload(file: File, url: string) {
        fetch(`/api/folders/${folderId}/files`, {
            method: "POST",
            body: JSON.stringify({
                name: file.name,
                file: url,
                fileSize: file.size,
                fileType: file.type,
            }),
        });
    }

    const onOk = useCallback(async () => {
        loading.on();

        for (let i = 0; i < upload.files.length; i++) {
            const file = upload.files[i];
            const uploadUrl = urls[file.name];
            console.log(file, urls);

            const form = new FormData();
            form.append(file.name, file);

            if (file && uploadUrl) {
                axios
                    .put(uploadUrl, form, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                        onUploadProgress: _.throttle((evt) => {
                            const progress = evt.progress ?? 0.5;
                            update(["progress", i, progress * 100]);
                        }, 500),
                    })
                    .then(() => {
                        update(["progress", i, 100]);
                        notifyUpload(file, uploadUrl);
                    });
            } else {
                update(["progress", i, -1]);
            }
        }

        loading.off();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [upload, urls]);

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

    useEffect(() => {
        if (upload.files.length) {
            fetching.on();
            fetch("/api/uploads", {
                method: "POST",
                body: JSON.stringify({
                    fileNames: upload.files.map((f) => f.name),
                }),
            })
                .then((res) => {
                    if (res.ok) {
                        res.json().then((urls) => {
                            setUrls(urls);
                        });
                    } else if (res.status === 401) {
                        gotoLogin();
                    } else {
                        //
                    }
                })
                .finally(() => {
                    fetching.off();
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [upload.files]);

    return (
        <Modal
            centered
            okText={isFetchingUrls ? "Preparing" : "Upload"}
            cancelText="Cancel"
            confirmLoading={isLoading}
            okButtonProps={{ disabled: isFetchingUrls || isLoading }}
            {...{ title, onOk, open: isOpen, onCancel }}
        >
            <UploadFileList progress={progress} />
        </Modal>
    );
}
