import { ElementProps } from "@/types/element-props";

export interface FormFieldError {
    hasError?: boolean;
    errorMessages?: string[]
}

interface FormFieldErrorProps extends ElementProps<HTMLSpanElement>, FormFieldError {
  //
}

export function FormFieldError({
    hasError,
    errorMessages,
    name,
}: FormFieldErrorProps) {
    if (!hasError) return null;

    return (
        <span className="text-sm text-red-600" id={name + "_error"}>
            <ul>
                {errorMessages?.map((msg, idx) => (
                    <li key={idx}>{msg}</li>
                ))}
            </ul>
        </span>
    );
}
