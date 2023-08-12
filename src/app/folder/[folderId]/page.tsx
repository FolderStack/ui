"use client";
import { DropZone, FolderGrid } from "@/components";
import { FolderList } from "@/components/Folder/FolderList";
import { useBoolean, useDisplayType, usePageData, useUpload } from "@/hooks";
import { useEffect, useMemo } from "react";

export default function FolderPage() {
    const [showLoader, loader] = useBoolean();
    const pageData = usePageData();
    const upload = useUpload();

    const displayType = useDisplayType();

    /**
     * If the loading of the page data is taking longer than 500ms
     * start showing a loader component.
     *
     * We're only doing this to avoid flashing loaders when data is
     * fetched quickly.
     */
    useEffect(() => {
        const timer = () =>
            setTimeout(() => {
                loader.on();
            }, 500);

        if (pageData.isLoading) {
            const timerInst = timer();
            return () => clearTimeout(timerInst);
        } else {
            // Debounce disabling the loader in case
            // the fetch has completed within a short
            // period after starting the loader.
            setTimeout(() => {
                loader.off();
            }, 300);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageData.isLoading]);

    const content = useMemo(() => {
        if (displayType.type === "list") {
            return <FolderList />;
        }
        return <FolderGrid />;
    }, [displayType]);

    return (
        <DropZone onDrop={upload.openModal}>
            {showLoader ? <>Loading</> : content}
        </DropZone>
    );
}
