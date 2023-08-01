"use client";
import { DropZone, File, Folder } from "@/components";
import { useBoolean, usePageData, useUpload } from "@/hooks";
import { Empty, Row } from "antd";
import { useEffect, useMemo } from "react";

export default function FolderPage() {
    const pageData = usePageData();
    const upload = useUpload();
    const children = useMemo(
        () => pageData?.data?.data?.items ?? [],
        [pageData]
    );

    const [showLoader, loader] = useBoolean();

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

    return (
        <DropZone onDrop={upload.openModal}>
            {showLoader ? (
                <>Loading</>
            ) : (
                <Row
                    style={{
                        gap: "24px",
                        flexWrap: "wrap",
                        paddingBottom: "32px",
                    }}
                >
                    {children.map((c: any, idx: number) => {
                        if (c.type === "folder") {
                            return <Folder key={idx} data={c} />;
                        } else if (c.type === "file") {
                            return <File key={idx} data={c} />;
                        }
                    })}
                    {children.length === 0 && (
                        <Row
                            style={{ width: "100%", marginTop: "64px" }}
                            justify="center"
                        >
                            <Empty
                                description="Nothing found"
                                style={{
                                    opacity: 1,
                                    color: "black !important",
                                }}
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                            />
                        </Row>
                    )}
                </Row>
            )}
        </DropZone>
    );
}
