import { useBoolean } from "@/hooks";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal } from "antd";
import { useParams } from "next/navigation";

export function CreateFolderModal() {
    const [form] = Form.useForm();
    const [isLoading, loading] = useBoolean(false);
    const [isOpen, open] = useBoolean(false);

    const params = useParams();
    const folderId = params.folderId;

    function onOk() {
        form.submit();
    }

    function onClose() {
        form.resetFields();
        loading.off();
        open.off();
    }

    async function handleSubmit(values: any) {
        loading.on();
        console.log(values);
        setTimeout(() => {
            onClose();
        }, 5000);
    }

    return (
        <>
            <Button icon={<PlusOutlined />} onClick={open.on}>
                New Folder
            </Button>
            <Modal
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
                </Form>
            </Modal>
        </>
    );
}
