"use client";
import { useBoolean, useMenu, useTree } from "@/hooks";
import { gotoLogin } from "@/utils";
import { Button, Modal } from "antd";
import useMessage from "antd/es/message/useMessage";
import { useParams, useRouter } from "next/navigation";

export function DeleteFolderModal() {
    const tree = useTree();
    const menu = useMenu();
    const [isLoading, loading] = useBoolean(false);
    const [isOpen, open] = useBoolean(false);
    const [messageApi, contextHolder] = useMessage();
    const router = useRouter();

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
                    const parent = menu.getParent(folderId);
                    if (parent) {
                        const q = new URL(window.location.href).search;
                        router.replace(`/folders/${parent}?${q}`);
                    }
                    messageApi.success("Deleted folder");
                    onClose();
                } else if (res.status === 401) {
                    gotoLogin();
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
