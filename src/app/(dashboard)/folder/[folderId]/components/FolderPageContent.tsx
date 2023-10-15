"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DragProvider } from "./Items/Drag/DragContext";
import { DragLayer } from "./Items/Drag/DragLayer";
import { File } from "./Items/File";
import { Folder } from "./Items/Folder";

interface FolderPageContentProps {
    items: any[];
}

export function FolderPageContent({ items = [] }: FolderPageContentProps) {
    return (
        <div
            className="grid gap-4"
            style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            }}
        >
            <DndProvider backend={HTML5Backend}>
                <DragProvider>
                    <DragLayer {...{ items }} />
                    {items.map((item) => {
                        if (item.type === "folder") {
                            return <Folder key={item.id} {...item} />;
                        }
                        return <File key={item.id} {...item} />;
                    })}
                </DragProvider>
            </DndProvider>
        </div>
    );
}
