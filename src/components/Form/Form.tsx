"use client";

import { PropsWithChildren } from "react";
import { FormStatusToast } from "../Toast";
import { FormProps, FormProvider } from "./FormContext";
import { FormField } from "./FormField";
import { FormFieldError } from "./FormFieldError";
import { FormSecureFields } from "./FormSecureFields";
import { FormSubmit } from "./FormSubmitButton";

export function Form({ children, ...props }: FormProps) {
    return (
        <FormProvider {...props}>
            {children}
        </FormProvider>
    )
}

function Blank({ children, ...props }: Partial<FormProps>) {
    return (
        <FormProvider {...props} initialValues={props.initialValues ?? {}}>
            {children}
        </FormProvider>
    )
}

Form.Field = FormField;
Form.FieldError = FormFieldError;
Form.Submit = FormSubmit;
Form.StatusToast = FormStatusToast;
Form.SecureFields = FormSecureFields;
Form.Blank = Blank;