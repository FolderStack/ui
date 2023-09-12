"use client";
import { FolderGrid } from "@/components";
import { FolderList } from "@/components/Folder/FolderList";
import { useDisplayType } from "@/hooks";
import { useMemo } from "react";

export default function FolderPage() {
    const displayType = useDisplayType();

    const content = useMemo(() => {
        if (displayType.type === "list") {
            return <FolderList />;
        }
        return <FolderGrid />;
    }, [displayType]);

    return content;
}
