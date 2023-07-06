"use client";
import { DropZone, File, Folder, Row } from "@/components";
import { useUpload } from "@/hooks";
import { withMainLayout } from "@/sections";

function HomePage() {
    const { data = {} } = {} as any;
    const upload = useUpload();
    const children = data?.children ?? [];

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
                        {/* <Empty
                            description="Nothing found"
                            style={{ opacity: 1, color: "black !important" }}
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        /> */}
                    </Row>
                )}
            </Row>
        </DropZone>
    );
}

export default withMainLayout(HomePage);
