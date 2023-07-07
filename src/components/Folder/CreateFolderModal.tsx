"use client";
import { UploadFileItem } from "@/components/FileUpload/UploadFileItem";
import { useBoolean, useTree } from "@/hooks";
import { Button, Form, Input, Modal, Space, Upload } from "antd";
import { useForm } from "antd/es/form/Form";
import useMessage from "antd/es/message/useMessage";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useState } from "react";

const PlusOutlined = dynamic(() => import("@ant-design/icons/PlusOutlined"));
const UploadOutlined = dynamic(
    () => import("@ant-design/icons/UploadOutlined")
);

export function CreateFolderModal() {
    const tree = useTree();
    const [form] = useForm();
    const [isLoading, loading] = useBoolean(false);
    const [isOpen, open] = useBoolean(false);
    const [image, setImage] = useState<File>();
    const [uploadProgress, setProgress] = useState<number>();
    const [messageApi, contextHolder] = useMessage();

    const params = useParams();
    const folderId = params.folderId;

    function onOk() {
        form.submit();
    }

    function onClose() {
        setImage(undefined);
        setProgress(undefined);
        form.resetFields();
        loading.off();
        open.off();
    }

    async function handleSubmit(values: any) {
        loading.on();

        const folderName = values.folderName;
        const parentFolderId = folderId;

        fetch("/api/folders", {
            method: "POST",
            body: JSON.stringify({
                name: folderName,
                parent: parentFolderId,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => {
                if (res.ok) {
                    tree.reload();
                    messageApi.success("Created folder");
                    onClose();
                } else {
                    messageApi.error("An error occured");
                    loading.off();
                }
            })
            .catch(() => {
                messageApi.error("An error occured");
                loading.off();
            });
    }

    return (
        <>
            {contextHolder}
            <Button onClick={open.on}>New Folder</Button>
            <Modal
                centered
                open={isOpen}
                title="Create a new folder"
                okText="Create Folder"
                onOk={onOk}
                onCancel={onClose}
                confirmLoading={isLoading}
            >
                <Form
                    form={form}
                    requiredMark={false}
                    layout="vertical"
                    style={{ paddingTop: "24px", paddingBottom: "24px" }}
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Folder Name"
                        name="folderName"
                        rules={[
                            {
                                message: "A folder name is required.",
                                async validator(_, value) {
                                    if (
                                        typeof value !== "string" ||
                                        !value.trim().length
                                    ) {
                                        return Promise.reject();
                                    }
                                },
                            },
                        ]}
                    >
                        <Input type="text" placeholder="My new folder" />
                    </Form.Item>
                    <Form.Item label="Featured Image">
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Upload
                                showUploadList={false}
                                beforeUpload={(_, files) => {
                                    setImage(files[0]);
                                    return false;
                                }}
                            >
                                <Button icon={<UploadOutlined />}>
                                    Upload
                                </Button>
                            </Upload>
                            {image && (
                                <UploadFileItem
                                    file={image}
                                    progress={uploadProgress}
                                    onRemove={() => setImage(undefined)}
                                />
                            )}
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
