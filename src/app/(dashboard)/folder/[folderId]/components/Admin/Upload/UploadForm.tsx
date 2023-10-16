"use client";
import { classNames } from "@/utils";
import axios, { AxiosError, AxiosProgressEvent, CanceledError } from "axios";
import { throttle } from "lodash";
import { useParams, useRouter } from "next/navigation";
import plimit from "p-limit";
import {
    FormEvent,
    useMemo,
    useReducer,
    useRef,
    useState,
    useTransition,
} from "react";
import { useDropzone } from "react-dropzone";
import { UploadRow } from "./UploadRow";
import { progressReducer } from "./progressReducer";

interface UploadFormProps {
    onDone(refresh?: boolean): void;
}

export function UploadForm({ onDone }: UploadFormProps) {
    const params = useParams();
    const router = useRouter();
    const [uploadProgress, updateProgress] = useReducer(progressReducer, []);
    const [pending, startTransition] = useTransition();

    const [files, setFiles] = useState<File[]>([]);
    const { getRootProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setFiles((files) => [...files, ...acceptedFiles]);
        },
    });

    const abortController = useRef<AbortController | null>(null);

    function removeFile(file: File, idx: number) {
        setFiles((files) => files.filter((f) => f !== file));
        // Remove from progress...
        updateProgress({
            file,
            index: idx,
            progress: null,
        });
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // TODO: Handle uploading to the root directory... maybe use orgId as the id of that folder?
        const folderId = params.folderId ?? null;

        startTransition(async () => {
            const limit = plimit(3);
            abortController.current = new AbortController();

            const promises = files.map(async (file, i) => {
                const formData = new FormData();
                formData.append(`file`, file);

                // Skip the file if it's already been uploaded.
                // Useful when trying to re-upload because an error occured,
                // but don't want to re-upload successful files.
                const fileStatus = uploadProgress.find((v) => v.file === file);
                if (fileStatus?.progress === 100) return Promise.resolve();

                return limit(() =>
                    axios
                        .post(
                            `/api/v1/folders/${folderId ?? "@root"}/files`,
                            formData,
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                                signal: abortController.current?.signal,
                                onUploadProgress: throttle(
                                    (progressEvent: AxiosProgressEvent) => {
                                        const progress = Math.round(
                                            (progressEvent.loaded * 100) /
                                                (progressEvent.total ?? 1)
                                        );
                                        if (progress < 100) {
                                            // Update the progress as usual if it's less than 100%
                                            updateProgress({
                                                progress,
                                                index: i,
                                                file,
                                            });
                                        } else {
                                            // If progress is 100%, set an intermediate state like 99% until we're sure it's successful
                                            updateProgress({
                                                progress: 99,
                                                index: i,
                                                file,
                                            });
                                        }
                                    },
                                    500
                                ),
                            }
                        )
                        .then(() => {
                            updateProgress({
                                progress: 100,
                                index: i,
                                file,
                                confirmed: true,
                            });
                        })
                        .catch((err) => {
                            if (err instanceof AxiosError) {
                                updateProgress({
                                    progress: -1,
                                    index: i,
                                    file,
                                    error: err.message,
                                    confirmed: true,
                                });
                                if (err.response?.status === 401) {
                                    abortController.current?.abort();
                                    abortController.current = null;

                                    const url = new URL(window.location.href);
                                    return router.replace(
                                        `/api/auth/signin?callbackUrl=${encodeURIComponent(
                                            url.pathname + url.search
                                        )}`
                                    );
                                }
                            } else if (err instanceof CanceledError) {
                                return;
                            }
                            updateProgress({
                                progress: -1,
                                index: i,
                                file,
                                confirmed: true,
                                error:
                                    err?.message ?? "An unknown error occured",
                            });
                        })
                );
            });

            await Promise.allSettled(promises);
            abortController.current = null;
        });
    }

    const totalUploading = files.length;
    const totalErrors = useMemo(
        () => uploadProgress.filter(({ progress }) => progress === -1).length,
        [uploadProgress]
    );
    const totalFinished = useMemo(
        () =>
            uploadProgress.filter(
                ({ progress }) => progress !== -1 && progress === 100
            ).length,
        [uploadProgress]
    );

    const uploadFinished = useMemo(
        () => totalUploading - (totalErrors + totalFinished) === 0,
        [totalErrors, totalFinished, totalUploading]
    );

    const allUploaded = useMemo(
        () => totalUploading === totalFinished && totalUploading > 0,
        [totalFinished, totalUploading]
    );

    function close() {
        if (abortController.current) {
            abortController.current.abort();
        }

        onDone();
        router.refresh();
        setTimeout(() => {
            setFiles([]);
            updateProgress("clear");
        }, 1000);
    }

    const submitText = useMemo(() => {
        if (pending) {
            if (uploadFinished) {
                return "Storing";
            }
            return "Uploading";
        }
        return "Upload";
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, undefined);

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full space-y-6"
        >
            {!!files.length && (
                <div className="flex flex-col space-y-1">
                    {files.map((file, idx) => (
                        <UploadRow
                            key={file.name + file.lastModified + file.size}
                            file={file}
                            progress={uploadProgress[idx]}
                            onRemove={() => removeFile(file, idx)}
                        />
                    ))}
                </div>
            )}
            <div
                {...getRootProps()}
                className={classNames(
                    "w-full border-dashed border-2 border-gray-300 rounded flex justify-center items-center hover:bg-gray-100 transition-all ease-in-out",
                    classNames(
                        allUploaded || pending ? "hidden" : "cursor-pointer",
                        classNames(files.length ? "h-24" : "h-52")
                    )
                )}
            >
                <div className="opacity-60 text-center">
                    Drag and drop files here
                    <br />
                    or click to open the file browser
                </div>
            </div>

            <div className="ml-auto space-x-4">
                <button
                    type="reset"
                    className={classNames(
                        "transition-all ease-in-out font-medium inline-flex justify-center rounded border border-transparent  px-4 py-2 hover:opacity-80 focus:outline-none",
                        allUploaded
                            ? "text-white bg-primary-300"
                            : "hover:bg-gray-300"
                    )}
                    onClick={close}
                >
                    {uploadFinished ? "Done" : "Cancel"}
                </button>
                <button
                    disabled={pending || !files.length}
                    type="submit"
                    className={classNames(
                        "transition-all ease-in-out text-white font-medium inline-flex justify-center rounded border border-transparent bg-primary-300 px-4 py-2 hover:opacity-80 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
                        allUploaded ? "hidden" : "visible"
                    )}
                >
                    {submitText ?? "Upload"}
                </button>
            </div>
        </form>
    );
}
