"use client";

import { useSession } from "next-auth/react";
import { DragLayer } from "../../../../../components/Drag/DragLayer";
import { File } from "./Items/File";
import { Folder } from "./Items/Folder";

interface FolderPageContentProps {
    items: any[];
}

export function FolderPageContent({ items = [] }: FolderPageContentProps) {
    const session = useSession();
    const isAdmin = session.data?.user?.role === "admin";

    return (
        <div
            className="grid gap-4"
            style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            }}
        >
            {isAdmin && <DragLayer {...{ items }} />}
            {items.map((item) => {
                if (item.type === "folder") {
                    return <Folder key={item.id} {...item} />;
                }
                return <File key={item.id} {...item} />;
            })}
        </div>
    );
}
