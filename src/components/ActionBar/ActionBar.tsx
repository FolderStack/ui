"use client";
import { useDisplayType, useFilter, usePageData } from "@/hooks";
import dynamic from "next/dynamic";
import { Row, Title, Tooltip } from "../Elements";
import { SortActions } from "./SortActions";

const FilterOutlined = dynamic(
    () => import("@ant-design/icons/FilterOutlined")
);
const AppstoreOutlined = dynamic(
    () => import("@ant-design/icons/AppstoreOutlined")
);
const UnorderedListOutlined = dynamic(
    () => import("@ant-design/icons/UnorderedListOutlined")
);

export function ActionBar() {
    const pageData = usePageData();
    const folderName = pageData.data?.folder?.name;

    const { isVisible, visible } = useFilter();
    const title = isVisible ? "Hide the filter bar" : "Show the filter bar";

    const dt = useDisplayType();

    return (
        <Row align="middle" justify="space-between">
            <Title size="h1">{folderName}</Title>
            <Row align="middle" style={{ marginBottom: "16px", gap: "16px" }}>
                <SortActions />
                <span className="isolate inline-flex rounded-md shadow-sm">
                    <Tooltip content={title}>
                        <button
                            onClick={visible.toggle}
                            type="button"
                            className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                        >
                            <FilterOutlined />
                        </button>
                    </Tooltip>
                    <button
                        type="button"
                        className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                        onClick={() => dt.change("grid")}
                    >
                        <AppstoreOutlined />
                    </button>
                    <button
                        type="button"
                        className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
                        onClick={() => dt.change("list")}
                    >
                        <UnorderedListOutlined />
                    </button>
                </span>
            </Row>
        </Row>
    );
}
