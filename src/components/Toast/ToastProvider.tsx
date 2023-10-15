"use client";

import { PropsWithChildren, createContext, useContext, useState } from "react";
import { Toast } from "./Toast";

interface Toast {
    id: string;
    hash: string;
    title: string;
    message: string;
    type: "success" | "error";
}

const ToastContext = createContext({
    add(
        title: string,
        message: string,
        type: "success" | "error",
        id?: string
    ) {
        // noop
    },
});

interface ToastProviderProps extends PropsWithChildren {
    timeout?: number;
}

export function ToastProvider({
    children,
    timeout = 5000,
}: ToastProviderProps) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    function add(
        title: string,
        message: string,
        type: "success" | "error",
        id?: string
    ) {
        const toastId = id || Math.random().toString(36).substring(2, 9);
        const hash = String(title + message + type)
            .toLowerCase()
            .replace(/\s/g, "");

        if (exists(hash) || exists(toastId)) return;

        setToasts([...toasts, { title, message, type, id: toastId, hash }]);
        setTimeout(() => remove(toastId), timeout);
    }

    function exists(idOrHash: string) {
        return toasts.some((t) => t.hash === idOrHash || t.id === idOrHash);
    }

    function remove(id: string) {
        setToasts(toasts.filter((t) => t.id !== id));
    }

    return (
        <ToastContext.Provider value={{ add }}>
            {children}
            <div
                aria-live="assertive"
                className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
            >
                <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
                    {toasts.map((toast) => (
                        <Toast {...toast} key={toast.id} />
                    ))}
                </div>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    return useContext(ToastContext);
}
