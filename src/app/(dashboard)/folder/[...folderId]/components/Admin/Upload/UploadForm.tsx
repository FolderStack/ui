"use client";
import { classNames } from "@/utils";
import axios, { AxiosError, AxiosProgressEvent, CanceledError } from "axios";
import { throttle } from "lodash";
import { useParams, useRouter } from "next/navigation";
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
    onDone(): void;
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

    function removeFile(file: File) {
        setFiles((files) => files.filter((f) => f !== file));
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const folderId = params.folderId.toString();

        startTransition(async () => {
            abortController.current = new AbortController();

            await Promise.allSettled(
                files.map(async (file, i) => {
                    const formData = new FormData();
                    formData.append(`file`, file);

                    // Skip the file if it's already been uploaded.
                    // Useful when trying to re-upload because an error occured,
                    // but don't want to re-upload successful files.
                    const fileStatus = uploadProgress.find(
                        (v) => v.file === file
                    );
                    if (fileStatus?.progress === 100) return Promise.resolve();

                    return await axios
                        .post(`/api/v1/folders/${folderId}/files`, formData, {
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
                        })
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
                        });
                })
            );
        });
    }

    function close() {
        onDone();
        setFiles([]);
        updateProgress("clear");
    }

    const totalUploading = files.length;
    const totalErrors = uploadProgress.filter(
        ({ progress }) => progress === -1
    ).length;
    const totalFinished = uploadProgress.filter(
        ({ progress }) => progress !== -1 && progress === 100
    ).length;

    const uploadFinished = totalUploading - (totalErrors + totalFinished) === 0;

    const submitText = useMemo(() => {
        if (pending) {
            if (uploadFinished) {
                return "Storing";
            }
            return "Uploading";
        }
        return "Upload";
    }, [uploadProgress, pending, files.length]);

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full space-y-6"
        >
            {!!files.length && (
                <div className="flex flex-col space-y-1">
                    {files.map((file, idx) => (
                        <UploadRow
                            key={idx}
                            file={file}
                            progress={uploadProgress[idx]}
                            onRemove={() => removeFile(file)}
                        />
                    ))}
                </div>
            )}
            <div
                {...getRootProps()}
                className={classNames(
                    "w-full border-dashed border-2 border-gray-300 rounded flex justify-center items-center hover:bg-gray-100 transition-all ease-in-out",
                    classNames(
                        pending
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer",
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
                    className="font-medium inline-flex justify-center rounded border border-transparent hover:bg-gray-300 px-4 py-2 hover:opacity-80 focus:outline-none"
                    onClick={close}
                >
                    {uploadFinished ? "Done" : "Cancel"}
                </button>
                <button
                    disabled={pending || !files.length || uploadFinished}
                    type="submit"
                    className="text-white font-medium inline-flex justify-center rounded border border-transparent bg-primary-300 px-4 py-2 hover:opacity-80 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitText ?? "Upload"}
                </button>
            </div>
        </form>
    );
}
