import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import {
    AiOutlineClose,
} from "react-icons/ai";
import { ToastIcon } from "./ToastIcon";

interface ToastProps {
    id: string;
    title: string;
    message: string;
    type: "success" | "error";
}

export function Toast({ title, message, type, id }: ToastProps) {
    const [show, setShow] = useState(true);

    return (
        <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <ToastIcon {...{ type }} />
                        </div>
                        <div className="ml-3 w-0 flex-1 pt-0.5">
                            <p className="text-sm font-medium text-gray-900 capitalize">
                                {title}
                            </p>
                            <p className="mt-1 text-sm text-gray-500">
                                {message}
                            </p>
                        </div>
                        <div className="ml-4 flex flex-shrink-0">
                            <button
                                type="button"
                                className="inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
                                onClick={() => setShow(false)}
                            >
                                <span className="sr-only">
                                    Close
                                </span>
                                <AiOutlineClose
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    );
}
