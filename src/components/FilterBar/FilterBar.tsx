"use client";
import { useFilter } from "@/hooks";
import { Button, DatePicker, Form, Row, Select, Tooltip } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";

export function FilterBar() {
    const [form] = useForm();
    const filter = useFilter();

    const to = Form.useWatch("to", form);
    const from = Form.useWatch("from", form);
    const fileTypes = Form.useWatch("fileTypes", form);

    function applyFilter(values: any) {
        if (values.to) {
            values.to = values.to.toDate();
        }

        if (values.from) {
            values.from = values.from.toDate();
        }

        filter.apply(values);
    }

    function resetFilter() {
        form.resetFields(["from", "to", "fileTypes"]);
        filter.clear();
    }

    const hasFilterValues = useMemo(() => {
        return from || to || !!fileTypes?.length;
    }, [from, to, fileTypes]);

    useEffect(() => {
        const _to = filter.filter.to;
        const _from = filter.filter.from;
        const _fileTypes = filter.filter.fileTypes;

        if (_to) {
            form.setFieldValue("to", dayjs(_to.toISOString()));
        }

        if (_from) {
            form.setFieldValue("from", dayjs(_from.toISOString()));
        }

        if (_fileTypes) {
            form.setFieldValue("fileTypes", _fileTypes);
        }
    }, [filter, form]);

    if (!filter.isVisible) return null;

    return (
        <Row>
            <Form
                form={form}
                layout="vertical"
                name="filter"
                onFinish={applyFilter}
                style={{
                    display: "flex",
                    flexDirection: "row",
                    columnGap: "16px",
                    flexWrap: "wrap",
                }}
            >
                <Form.Item
                    label="Filter from"
                    name="from"
                    style={{ marginBottom: "8px" }}
                >
                    <DatePicker
                        format="DD/MM/YYYY"
                        size="large"
                        style={{ minWidth: "160px" }}
                    />
                </Form.Item>
                <Form.Item
                    label="Filter to"
                    name="to"
                    style={{ marginBottom: "8px" }}
                >
                    <DatePicker
                        format="DD/MM/YYYY"
                        size="large"
                        style={{ minWidth: "160px" }}
                    />
                </Form.Item>
                <Form.Item
                    label="File types"
                    name="fileTypes"
                    style={{ marginBottom: "8px" }}
                >
                    <Select
                        showSearch
                        size="large"
                        placeholder="Select file types"
                        mode="multiple"
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        notFoundContent={null}
                        options={OPTIONS}
                        style={{ minWidth: "180px", maxWidth: "300px" }}
                    />
                </Form.Item>
                <Form.Item label=" ">
                    <Tooltip
                        title={
                            hasFilterValues
                                ? "Filter the items on this page"
                                : "Select filters to apply"
                        }
                    >
                        <Button
                            htmlType="submit"
                            size="large"
                            disabled={!hasFilterValues}
                        >
                            Apply Filters
                        </Button>
                    </Tooltip>
                </Form.Item>
                <Form.Item label=" ">
                    <Tooltip
                        title={
                            hasFilterValues ? "Clear & reset the filters" : ""
                        }
                    >
                        <Button
                            size="large"
                            danger
                            onClick={resetFilter}
                            disabled={!hasFilterValues}
                        >
                            Clear
                        </Button>
                    </Tooltip>
                </Form.Item>
            </Form>
        </Row>
    );
}

const OPTIONS = [
    {
        label: "ai",
        value: "ai",
    },
    {
        label: "csv",
        value: "csv",
    },
    {
        label: "gif",
        value: "gif",
    },
    {
        label: "jpg",
        value: "jpg",
    },
    {
        label: "mov",
        value: "mov",
    },
    {
        label: "mp4",
        value: "mp4",
    },
    {
        label: "pdf",
        value: "pdf",
    },
    {
        label: "png",
        value: "png",
    },
    {
        label: "psd",
        value: "psd",
    },
    {
        label: "xlsx",
        value: "xlsx",
    },
    {
        label: "zip",
        value: "zip",
    },
];
