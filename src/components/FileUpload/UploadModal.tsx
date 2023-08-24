"use client";
import { config } from "@/config";
import { useAccessToken, useBoolean, usePageData, useUpload } from "@/hooks";
import { gotoLogin } from "@/utils";
import { Modal } from "antd";
import axios from "axios";
import { throttle } from "lodash";
import {
    useCallback,
    useEffect,
    useMemo,
    useReducer,
    useRef,
    useState,
} from "react";
import { UploadFileList } from "./UploadFileList";

interface UploadModalProps {
    isOpen: boolean;
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
    const getToken = useAccessToken();

    const [urls, setUrls] = useState<Record<string, string>>({});

    const folderName = pageData.data?.data?.current?.name;
    const folderId = pageData.data?.data?.current?.id;

    const [progress, update] = useReducer(reducer, []);

    async function notifyUpload(file: File, url: string) {
        fetch(`${config.api.baseUrl}/folders/${folderId}/files`, {
            method: "POST",
            body: JSON.stringify({
                name: file.name,
                file: url,
                fileSize: file.size,
                fileType: file.type,
            }),
            headers: {
                Authorization: getToken(),
            },
        });
    }

    const [overallStatus, setOverallStatus] = useState<number>(0);
    const hasUploaded = useMemo(
        () => overallStatus >= upload.files.length,
        [overallStatus, upload]
    );

    const abortController = useRef<AbortController | null>(null);

    const onOk = useCallback(async () => {
        if (hasUploaded) {
            return onCancel();
        }

        loading.on();
        const ctrl = new AbortController();
        abortController.current = ctrl;

        try {
            for (let i = 0; i < upload.files.length; i++) {
                const file = upload.files[i];
                const uploadUrl = urls[file.name];

                const form = new FormData();
                form.append(file.name, file);

                if (file && uploadUrl) {
                    axios
                        .put(uploadUrl, form, {
                            // headers: {
                            //     // "Content-Type": "multipart/form-data",
                            // },
                            onUploadProgress: throttle((evt) => {
                                const progress = evt.progress ?? 0.5;
                                update(["progress", i, progress * 100]);
                            }, 500),
                            signal: ctrl.signal,
                        })
                        .then(() => {
                            update(["progress", i, 100]);
                            notifyUpload(file, uploadUrl);
                        })
                        .finally(() => {
                            // Increment overall status counter once this request is done.
                            setOverallStatus((v) => v + 1);
                        });
                } else {
                    update(["progress", i, -1]);
                }
            }
        } catch (err) {
            //
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [upload, urls, hasUploaded]);

    useEffect(() => {
        if (overallStatus === upload.files.length) {
            loading.off();
            abortController.current = null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [upload.files, overallStatus]);

    function onCancel() {
        try {
            update(["clear"]);
            loading.off();

            // If atleast one thing has been uploaded, we'll refresh
            if (overallStatus > 0) {
                pageData.reload();
            }

            if (abortController.current) {
                abortController.current.abort();
            }

            setOverallStatus(0);
        } catch (err) {
            console.log(err);
        }
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
            fetch(`${config.api.baseUrl}/uploads`, {
                method: "POST",
                body: JSON.stringify({
                    fileNames: upload.files.map((f) => f.name),
                }),
                headers: {
                    Authorization: getToken(),
                },
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

    const text = useMemo(() => {
        if (isFetchingUrls) return "Preparing";
        if (isLoading) {
            if (hasUploaded) {
                return "Closing";
            }
            return "Uploading";
        }
        if (hasUploaded) return "Close";
        return "Upload";
    }, [hasUploaded, isFetchingUrls, isLoading]);

    return (
        <Modal
            centered
            okText={text}
            cancelText="Cancel"
            cancelButtonProps={{
                style: {
                    visibility: hasUploaded ? "hidden" : "visible",
                },
            }}
            confirmLoading={isLoading}
            okButtonProps={{
                disabled: isFetchingUrls || isLoading,
            }}
            {...{ title, onOk, open: isOpen, onCancel }}
        >
            <UploadFileList progress={progress} />
        </Modal>
    );
}
