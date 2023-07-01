"use client";
import { DropZone, File, Folder } from "@/components";
import { usePageData, useUpload } from "@/hooks";
import { withMainLayout } from "@/sections";
import { Row } from "antd";

function FolderPage() {
    const data = usePageData();
    const upload = useUpload();

    return (
        <DropZone onDrop={upload.openModal}>
            <Row style={{ gap: "24px", flexWrap: "wrap" }}>
                {data?.data?.children?.map?.((c: any, idx: number) => {
                    if (c.type === "folder") {
                        return <Folder key={idx} data={c} />;
                    } else if (c.type === "file") {
                        return <File key={idx} data={c} />;
                    }
                })}
            </Row>
        </DropZone>
    );
}

export default withMainLayout(FolderPage);
