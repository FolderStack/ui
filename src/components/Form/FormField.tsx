import React, { useEffect, useMemo } from "react";
import { ElementProps } from "@/types/element-props";
import { useForm } from "./FormContext";
import { FormFieldError } from "./FormFieldError";
import { classNames } from "@/utils";

interface FormFieldProps extends ElementProps<HTMLInputElement> {
    id?: string;
    name: string;
    label?: string;
    required?: boolean;
    hasError?: boolean;
    labelProps?: ElementProps<HTMLLabelElement>;
    containerProps?: ElementProps<HTMLSpanElement>;
}

export function FormField({ name, label, required, children, ...props }: FormFieldProps) {
    const form = useForm();

    const id = props.id || name;
    const labelId = id + "_label";
    const labelledBy = props['aria-labelledby'] ?? labelId;

    const isTouched = form.touched[name];
    const hasError = !!(form.errors[name] && isTouched);
    const errors = form.errors[name];
    const value = form.values[name];

    const childContext: ElementProps<HTMLInputElement> & FormFieldError = useMemo(() => ({
        onChange(e: React.ChangeEvent<any>) {
            form.onChange(name, e.target.value);
        },
        onBlur() {
            form.onBlur(name);
        },
        onSubmit() {
            form.onBlur(name);
        },
        id,
        name,
        error: hasError ? 'true' : undefined,
        value,
        'aria-labelledby': labelledBy,
        'aria-describedby': hasError ? name + '_error' : undefined,
        ...props
    }), [form, name, value, labelledBy, hasError, id, props])

    const errorContext: FormFieldError = useMemo(() => ({
        hasError,
        errorMessages: errors
    }), [errors, hasError])

    useEffect(() => {
        form.setFieldIgnored(name, !!props.disabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.disabled])

    const formChildren = useMemo(() => {
        return React.Children.map(children, child => {
            if (!React.isValidElement(child)) return child;

            if (child.type === FormFieldError) {
                return React.cloneElement(child, errorContext);
            }

            return React.cloneElement(child, childContext);
        })
    }, [children, childContext, errorContext])

    return (
        <span className="flex-1" {...(props.containerProps ?? {})}>
            {label && (
                <label
                    id={labelId}
                    htmlFor={props.id}
                    {...(props.labelProps ?? {})}
                    className={props.labelProps?.className || "block text-sm font-medium leading-6 text-gray-900 mb-1"}
                >
                    {label} {required ? <span className="text-red-500">*</span> : null}
                </label>
            )}
            {formChildren}
        </span>
    )
}