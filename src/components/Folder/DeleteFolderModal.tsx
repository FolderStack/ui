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
                    loading.off();
                    onClose();
                    const parent = menu.getParent(folderId.toString());
                    const q = new URL(window.location.href).search;
                    if (parent) {
                        router.push(`/folder/${parent}${q}`);
                    } else {
                        router.push(`/${q}`);
                    }
                    messageApi.success("Deleted folder");
                    tree.reload();
                } else if (res.status === 401) {
                    gotoLogin();
                } else {
                    messageApi.error("An error occured");
                    loading.off();
                }
            })
            .catch((err) => {
                console.log(err);
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
