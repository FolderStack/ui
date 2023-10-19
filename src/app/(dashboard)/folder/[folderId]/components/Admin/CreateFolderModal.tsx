"use client";

import { Input } from "@/components/Input";
import { Dialog, Transition } from "@headlessui/react";
import { useParams, useRouter } from "next/navigation";
import { Fragment, useEffect, useMemo, useState } from "react";
import ReactDom from "react-dom";
import { RiFolderAddFill } from "react-icons/ri";
import { useSWRConfig } from "swr";
import { createFolderAction } from "./actions";

const useFormState = (ReactDom as any).experimental_useFormState;
const useFormStatus = (ReactDom as any).experimental_useFormStatus;

function SubmitButton() {
    const { pending = false } = useFormStatus();

    return (
        <button
            disabled={pending}
            type="submit"
            className="text-white font-medium inline-flex justify-center rounded border border-transparent bg-primary-300 px-4 py-2 hover:opacity-80 focus:outline-none"
        >
            {pending ? "Creating" : "Create"}
        </button>
    );
}

export function CreateFolderModal() {
    const params = useParams();
    const [isOpen, setIsOpen] = useState(false);
    const [state, dispatch] = useFormState(createFolderAction, {});
    const { mutate } = useSWRConfig();
    const router = useRouter();

    const parent = useMemo(() => {
        return params.folderId ? String(params.folderId) : null;
    }, [params]);

    useEffect(() => {
        if (state.success && isOpen) {
            setIsOpen(false);

            mutate(`/api/v1/tree`);
            mutate(`/api/v1/folders/${parent ?? "@root"}/contents`);
            router.refresh();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    return (
        <>
            <button
                className="text-white font-medium inline-flex justify-center rounded border border-transparent bg-primary-300 px-4 py-2 hover:opacity-80 focus:outline-none"
                onClick={() => setIsOpen(true)}
            >
                <div className="flex flex-row items-center space-x-2">
                    <span>
                        <RiFolderAddFill />
                    </span>
                    <span>Create Folder</span>
                </div>
            </button>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={() => setIsOpen(false)}
                >
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
                                        Create Folder
                                    </Dialog.Title>
                                    <form
                                        action={dispatch}
                                        className="flex flex-col w-full space-y-6"
                                    >
                                        <Input
                                            type="text"
                                            name="name"
                                            className="rounded"
                                            defaultValue="Untitled folder"
                                            autoComplete="none"
                                            autoFocus
                                            onFocus={(e) => e.target.select()}
                                        />
                                        {parent && (
                                            <input
                                                type="hidden"
                                                name="parent"
                                                value={parent}
                                            />
                                        )}

                                        <div className="ml-auto space-x-4">
                                            <button
                                                type="reset"
                                                className="font-medium inline-flex justify-center rounded border border-transparent hover:bg-gray-300 px-4 py-2 hover:opacity-80 focus:outline-none"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                Cancel
                                            </button>
                                            <SubmitButton />
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
