"use client";
import { useUser } from "@/hooks";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import "./dropzone.css";

interface DropZoneProps {
    onDrop(file: File[]): void;
}

export function DropZone({
    children,
    onDrop,
}: PropsWithChildren<DropZoneProps>) {
    const user = useUser();
    const canUpload = user?.isAdmin;

    const dragEle = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const element = dragEle.current;
        if (!element) return;

        const dragEvents = ["dragenter", "dragover"];
        const dragEndEvents = ["dragleave"];
        const dropEvents = ["drop"];

        // Keep a counter of dragenter/dragover events
        let dragCounter = 0;

        const dragHandler = (e: DragEvent) => {
            e.preventDefault();
            dragCounter++;
            setIsDragging(true);
        };

        const dragLeaveHandler = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter--;
            if (dragCounter === 0) {
                setIsDragging(false);
            }
        };

        const dragDropHandler = (e: DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            dragCounter = 0;
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
            element.addEventListener(event, dragHandler as any)
        );
        dragEndEvents.forEach((event) =>
            element.addEventListener(event, dragLeaveHandler as any)
        );
        dropEvents.forEach((event) => {
            element.addEventListener(event, dragDropHandler as any);
        });

        return () => {
            dragEvents.forEach((event) => {
                element.removeEventListener(event, dragHandler as any);
            });
            dragEndEvents.forEach((event) => {
                element.removeEventListener(event, dragLeaveHandler as any);
            });
            dropEvents.forEach((event) => {
                element.removeEventListener(event, dragDropHandler as any);
            });
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
                        pointerEvents: "none",
                    }}
                >
                    Drop your files here
                </div>
            ) : null}
            <div className="dropzone" ref={dragEle}>
                {children}
            </div>
        </div>
    );
}
