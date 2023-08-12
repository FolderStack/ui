"use client";
import { File, Folder } from "@/components";
import { usePageData } from "@/hooks";
import { Empty, Row } from "antd";
import { useMemo } from "react";

export function FolderGrid() {
    const pageData = usePageData();
    const children = useMemo(
        () => pageData?.data?.data?.items ?? [],
        [pageData]
    );

    return (
        <Row
            style={{
                gap: "24px",
                flexWrap: "wrap",
                paddingBottom: "32px",
            }}
            className="list-grid"
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
    );
}
