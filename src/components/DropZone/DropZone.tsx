"use client";
import { useUser } from "@/hooks";
import { PropsWithChildren, useEffect, useState } from "react";

interface DropZoneProps {
    onDrop(file: File[]): void;
}

export function DropZone({
    children,
    onDrop,
}: PropsWithChildren<DropZoneProps>) {
    const user = useUser();
    const canUpload = user?.isAdmin;

    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const dragEvents = ["dragenter", "dragover"];
        const dragEndEvents = ["dragleave", "drop"];

        const dragHandler = (e: DragEvent) => {
            e.preventDefault();
            setIsDragging(true);
        };

        const dragEndHandler = (e: DragEvent) => {
            e.preventDefault();
            setIsDragging(false);

            if (e && e.dataTransfer && e.dataTransfer.items) {
                const files = [];
                for (let i = 0; i < e.dataTransfer.items.length; i++) {
                    if (e.dataTransfer.items[i].kind === "file") {
                        const file = e.dataTransfer.items[i].getAsFile();
                        if (file) files.push(file);
                    }
                }

                if (files.length) onDrop(files);
            }
        };

        dragEvents.forEach((event) =>
            window.addEventListener(event, dragHandler as any)
        );
        dragEndEvents.forEach((event) =>
            window.addEventListener(event, dragEndHandler as any)
        );

        return () => {
            dragEvents.forEach((event) =>
                window.removeEventListener(event, dragHandler as any)
            );
            dragEndEvents.forEach((event) =>
                window.removeEventListener(event, dragEndHandler as any)
            );
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            {isDragging && canUpload ? (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 9999,
                        color: "white",
                        fontSize: "32px",
                    }}
                >
                    Drop your files here
                </div>
            ) : null}
            {children}
        </div>
    );
}
