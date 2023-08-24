"use client";
import { config } from "@/config";
import { useAccessToken, useBoolean, usePageData, useSelection } from "@/hooks";
import { gotoLogin } from "@/utils";
import { Button, Modal } from "antd";
import useMessage from "antd/es/message/useMessage";
import { useParams } from "next/navigation";

export function DeleteSelectedModal() {
    const pageData = usePageData();
    const { selected } = useSelection();

    const [isLoading, loading] = useBoolean(false);
    const [isOpen, open] = useBoolean(false);
    const [messageApi, contextHolder] = useMessage();
    const { folderId = "ROOT" } = useParams();
    const getToken = useAccessToken();

    function onClose() {
        open.off();
    }

    async function handleSubmit() {
        loading.on();

        fetch(`${config.api.baseUrl}/folders/${folderId}/files`, {
            method: "DELETE",
            body: JSON.stringify({
                ids: selected,
            }),
            headers: {
                Authorization: getToken(),
            },
        })
            .then((res) => {
                if (res.ok) {
                    loading.off();

                    setTimeout(() => {
                        pageData.reload();
                    }, 350);

                    onClose();
                    messageApi.success("Deleted selected files");
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
            <Button danger onClick={open.on} disabled={!selected.length}>
                Delete Selected
            </Button>
            <Modal
                centered
                open={isOpen}
                title="Are you sure?"
                okText="Delete Selection"
                okType="danger"
                onOk={handleSubmit}
                okButtonProps={{ type: "primary" }}
                onCancel={onClose}
                confirmLoading={isLoading}
            >
                <span>
                    Deleting the selected files will be not be undoable and
                    these files will no longer be accessible. Are you sure you
                    want to continue?
                </span>
            </Modal>
        </>
    );
}
