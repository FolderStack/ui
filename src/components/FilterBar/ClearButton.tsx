import { Button, Form } from "antd";
import useFormInstance from "antd/es/form/hooks/useFormInstance";

export function ClearButton() {
    const form = useFormInstance();
    const fields = Form.useWatch("to", form);

    console.log(fields);

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
