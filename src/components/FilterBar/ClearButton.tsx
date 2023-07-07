import { Button, Form } from "antd";
import { useWatch } from "antd/es/form/Form";
import useFormInstance from "antd/es/form/hooks/useFormInstance";

export function ClearButton() {
    const form = useFormInstance();
    const fields = useWatch("to", form);

    return (
        <Form.Item label=" ">
            <Button
                size="large"
                danger
                onClick={() => form.resetFields(["from", "to", "fileTypes"])}
            >
                Clear
            </Button>
        </Form.Item>
    );
}
