import { usePageData, usePagination } from "@/hooks";
import { Button, Pagination, Tooltip } from "antd";
import ButtonGroup from "antd/es/button/button-group";

const PAGE_SIZES = [20, 50, 100];

export function PaginationActions() {
    const data = usePageData();
    const { pageSize, page, change } = usePagination();

    const children = data.data?.children ?? [];
    if (children.length < pageSize) return null;

    return (
        <>
            <Pagination
                size="small"
                pageSize={pageSize}
                defaultPageSize={PAGE_SIZES[0]}
                total={children.length ?? 0}
                showSizeChanger={false}
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
