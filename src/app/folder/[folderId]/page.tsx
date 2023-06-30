"use client";
import { DropZone, File, Folder } from "@/components";
import { useFileUpload, usePageData } from "@/hooks";
import { withMainLayout } from "@/sections";
import { Row } from "antd";
import { useParams } from "next/navigation";

function FolderPage() {
    const params = useParams();
    const data = usePageData();
    const onFileDrop = useFileUpload(params.folderId);

    return (
        <DropZone onDrop={onFileDrop}>
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
