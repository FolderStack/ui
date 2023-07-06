import { useWatch } from "antd/es/form/Form";
import useFormInstance from "antd/es/form/hooks/useFormInstance";
import { AntButton, AntFormItem } from "../Antd";

export function ClearButton() {
    const form = useFormInstance();
    const fields = useWatch("to", form);

    console.log(fields);

    return (
        <AntFormItem label=" ">
            <AntButton
                size="large"
                danger
                onClick={() => form.resetFields(["from", "to", "fileTypes"])}
            >
                Clear
            </AntButton>
        </AntFormItem>
    );
}
