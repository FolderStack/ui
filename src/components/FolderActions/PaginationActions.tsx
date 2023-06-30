import { usePageData, usePagination } from "@/hooks";
import { Button, Pagination, Tooltip } from "antd";
import ButtonGroup from "antd/es/button/button-group";

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
                defaultPageSize={20}
                total={data?.data?.children?.length ?? 0}
                showSizeChanger={false}
                onChange={change}
            />

            <ButtonGroup>
                <Tooltip title={"Display 20 results"}>
                    <Button
                        type={pageSize === 20 ? "primary" : "default"}
                        onClick={() => change(page, 20)}
                    >
                        20
                    </Button>
                </Tooltip>
                <Tooltip title={"Display 50 results"}>
                    <Button
                        type={pageSize === 50 ? "primary" : "default"}
                        onClick={() => change(page, 50)}
                    >
                        50
                    </Button>
                </Tooltip>
                <Tooltip title={"Display 100 results"}>
                    <Button
                        type={pageSize === 100 ? "primary" : "default"}
                        onClick={() => change(page, 100)}
                    >
                        100
                    </Button>
                </Tooltip>
            </ButtonGroup>
        </>
    );
}
