"use client";
import { DropZone, File, Folder } from "@/components";
import { usePageData, useUpload } from "@/hooks";
import { Row } from "antd";

export default function FolderPage() {
    const pageData = usePageData();
    const upload = useUpload();
    const children = pageData?.data?.data?.items ?? [];

    return (
        <DropZone onDrop={upload.openModal}>
            <Row style={{ gap: "24px", flexWrap: "wrap" }}>
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
                        {/* <AntEmpty
                            description="Nothing found"
                            style={{ opacity: 1, color: "black !important" }}
                            image={PRESENTED_IMAGE_SIMPLE}
                        /> */}
                    </Row>
                )}
            </Row>
        </DropZone>
    );
}
