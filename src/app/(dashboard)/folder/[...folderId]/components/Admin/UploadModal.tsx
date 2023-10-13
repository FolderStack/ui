"use client";

import ReactDom from "react-dom";
import { FormEvent, Fragment, useEffect, useReducer, useState, useTransition } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { uploadFilesAction } from "./actions";
import { useParams } from "next/navigation";
import { RiDeleteBin5Fill, RiFolderUploadFill } from "react-icons/ri";
import { useDropzone } from "react-dropzone";
import { classNames } from "@/utils";
import { formatFileSize } from "@/utils/formatFileSize";
import { throttle } from "lodash";
import axios, { AxiosProgressEvent } from "axios";
import {CircularProgress} from "@nextui-org/react";

const useFormState = (ReactDom as any).experimental_useFormState;

function progressReducer(state: number[], action: ['progress', number, number] | ['clear']) {
    const [type, index, value] = action;
    const newState = [...state];

    if (type === 'clear') return [];

    if (state.length - 1 < index) {
        newState.push(value)
    } else {
        newState[index] = value;
    }

    return newState;
}

export function UploadModal() {
    const params = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [state, dispatch] = useFormState(uploadFilesAction, {});
    
    const [pending, startTransition] = useTransition()

    const [files, setFiles] = useState<File[]>([]);
    const { getRootProps } = useDropzone({
        onDrop: (acceptedFiles) => {
            setFiles((files) => [...files, ...acceptedFiles]);
        },
    });


    useEffect(() => {
        if (state.success && isOpen) {
            close();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    function removeFile(file: File) {
        setFiles((files) => files.filter((f) => f !== file));
    }

    function close() {
        setIsOpen(false);
        setTimeout(() => {
            setFiles([]);
        }, 1000);
    }

    const [uploadProgress, updateProgress] = useReducer(progressReducer, []);
    console.log({uploadProgress})

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        const folderId = params.folderId.toString();

        startTransition(async () => {
            await Promise.allSettled(files.map(async (file, i) => {
                const formData = new FormData();
                formData.append(`file`, file);

                await axios.post(`/api/v1/folders/${folderId}/files`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: throttle((progressEvent: AxiosProgressEvent) => {
                        const progress = progressEvent.progress ?? 0.5;
                        updateProgress(['progress', i, progress]);
                    }, 500),
                }).then(() => {
                    updateProgress(['progress', i, 100]);
                }).catch(() => {
                    updateProgress(['progress', i, -1]);
                })
            }))
        });
    }

    return (
        <>
            <button
                className="text-white font-medium inline-flex justify-center rounded border border-transparent bg-primary-300 px-4 py-2 hover:opacity-80 focus:outline-none"
                onClick={() => setIsOpen(true)}
            >
                <div className="flex flex-row items-center space-x-2">
                    <span>
                        <RiFolderUploadFill />
                    </span>
                    <span>Upload</span>
                </div>
            </button>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={close}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded bg-white p-6 text-left align-middle shadow-xl transition-all space-y-6">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Upload
                                    </Dialog.Title>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="flex flex-col w-full space-y-6"
                                    >
                                        {!!files.length && (
                                            <div className="flex flex-col space-y-1">
                                                {files.map((file, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex flex-row w-full justify-between"
                                                    >
                                                        <div>{file.name}</div>
                                                        <div className="flex flex-row space-x-2 items-center">
                                                            {typeof uploadProgress[idx] === 'number' && uploadProgress[idx] >= 0 && <CircularProgress
                                                                aria-label="Uploading..."
                                                                size="sm"
                                                                value={uploadProgress[idx]}
                                                                color={uploadProgress[idx] === 100 ? 'success' : 'primary'}
                                                            />}
                                                            <span>
                                                                {formatFileSize(
                                                                    file.size
                                                                )}
                                                            </span>
                                                            <span
                                                                className="cursor-pointer hover:text-red-600"
                                                                role="button"
                                                                onClick={() =>
                                                                    removeFile(
                                                                        file
                                                                    )
                                                                }
                                                            >
                                                                <RiDeleteBin5Fill />
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        <div
                                            {...getRootProps()}
                                            className={classNames(
                                                "w-full border-dashed border-2 border-gray-300 rounded flex justify-center items-center hover:bg-gray-100 cursor-pointer transition-all ease-in-out",
                                                files.length ? "h-24" : "h-52"
                                            )}
                                        >
                                            <div className="opacity-60 text-center">
                                                Drag and drop files here
                                                <br />
                                                or click to open the file
                                                browser
                                            </div>
                                        </div>

                                        <div className="ml-auto space-x-4">
                                            <button
                                                type="reset"
                                                className="font-medium inline-flex justify-center rounded border border-transparent hover:bg-gray-300 px-4 py-2 hover:opacity-80 focus:outline-none"
                                                onClick={close}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                disabled={pending}
                                                type="submit"
                                                className="text-white font-medium inline-flex justify-center rounded border border-transparent bg-primary-300 px-4 py-2 hover:opacity-80 focus:outline-none"
                                            >
                                                {pending ? "Uploading" : "Upload"}
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
