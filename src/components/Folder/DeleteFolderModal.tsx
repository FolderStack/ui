"use client";
import { useBoolean, useTree } from "@/hooks";
import { Button, Modal } from "antd";
import useMessage from "antd/es/message/useMessage";
import { useParams } from "next/navigation";

export function DeleteFolderModal() {
    const tree = useTree();
    const [isLoading, loading] = useBoolean(false);
    const [isOpen, open] = useBoolean(false);
    const [messageApi, contextHolder] = useMessage();

    const params = useParams();
    const folderId = params.folderId;

    function onClose() {
        loading.off();
        open.off();
    }

    async function handleSubmit() {
        if (!folderId) return;

        loading.on();

        fetch("/api/folders/" + folderId, {
            method: "DELETE",
        })
            .then((res) => {
                if (res.ok) {
                    tree.reload();
                    messageApi.success("Deleted folder");
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
            <Button danger onClick={open.on}>
                Delete Folder
            </Button>
            <Modal
                centered
                open={isOpen}
                title="Are you sure?"
                okText="Delete Folder"
                okType="danger"
                onOk={handleSubmit}
                okButtonProps={{ type: "primary" }}
                onCancel={onClose}
                confirmLoading={isLoading}
            >
                <span>
                    Deleting the current folder will also delete all subfolders
                    and files, are you sure you want to proceed?
                </span>
            </Modal>
        </>
    );
}
