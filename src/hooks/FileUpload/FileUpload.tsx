"use client";
import { UploadModal } from "@/components";
import { PropsWithChildren, createContext, useCallback, useState } from "react";
import { useBoolean } from "../useBoolean";

interface FileUpload {
    files: File[];
    remove(index: number): void;
    openModal(files: File[]): void;
    closeModal(): void;
}

export const FileUpload = createContext<FileUpload>({
    files: [],
    openModal() {
        //
    },
    closeModal() {
        //
    },
    remove() {
        //
    },
});

export function FileUploadProvider({ children }: PropsWithChildren) {
    const [isOpen, modalOpen] = useBoolean(false);
    const [files, setFiles] = useState<File[]>([]);

    function openModal(files: File[]) {
        modalOpen.on();
        setFiles(files);
    }

    function closeModal() {
        modalOpen.off();
        setFiles([]);
    }

    const remove = useCallback(
        (index: number) => {
            const arr = [...files];
            arr.splice(index, 1);
            setFiles(arr);

            if (arr.length === 0) {
                close();
            }
        },
        [files]
    );
    return (
        <FileUpload.Provider
            value={{
                openModal,
                closeModal,
                files,
                remove,
            }}
        >
            {children}
            <UploadModal {...{ isOpen }} />
        </FileUpload.Provider>
    );
}
