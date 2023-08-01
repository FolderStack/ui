"use client";
import { usePageData, usePagination } from "@/hooks";
import { Button, Pagination, Tooltip } from "antd";
import ButtonGroup from "antd/es/button/button-group";
import { useMemo } from "react";

const PAGE_SIZES = [10, 20, 50];

export function PaginationActions() {
    const { data } = usePageData();
    const { pageSize, page, change } = usePagination();

    const children = useMemo(() => data?.data?.items ?? [], [data]);
    const totalItems = useMemo(() => data?.pagination?.totalItems, [data]);

    return (
        <>
            <Pagination
                size="small"
                pageSize={pageSize}
                defaultPageSize={PAGE_SIZES[0]}
                total={totalItems ?? children.length ?? 0}
                showSizeChanger={false}
                current={page}
                onChange={change}
            />

            <ButtonGroup>
                {PAGE_SIZES.map((size, idx) => (
                    <Tooltip key={idx} title={`Display ${size} results`}>
                        <Button
                            type={pageSize === size ? "primary" : "default"}
                            onClick={() => change(page, size)}
                        >
                            {size}
                        </Button>
                    </Tooltip>
                ))}
            </ButtonGroup>
        </>
    );
}
