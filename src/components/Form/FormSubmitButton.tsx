"use client";
import { classNames } from "@/utils";
import React from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "./FormContext";

interface FormSubmitProps {
    label: string | React.ReactNode;
    loadingLabel?: string | React.ReactNode;
    className?: string;
    blank?: boolean;
}

export function FormSubmit({
    label,
    loadingLabel,
    className,
    blank = false,
}: FormSubmitProps) {
    const form = useForm();
    const status = useFormStatus();

    function onClick(e: React.MouseEvent<HTMLButtonElement>) {
        if (!form.canSubmit && !blank) return;
        if (status.pending) {
            e.preventDefault();
            e.stopPropagation();
        } else {
            form.submit();
        }
    }

    const classes = [];

    if (!blank) {
        classes.push(
            "rounded-3xl text-white px-6 py-3 bg-secondary-400 disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
        );
    }

    classes.push(className ?? "");

    return (
        <button
            onClick={onClick}
            disabled={status.pending || (!blank && !form.canSubmit)}
            aria-disabled={status.pending || (!blank && !form.canSubmit)}
            className={classNames(...classes)}
        >
            {status.pending ? loadingLabel || label : label}
        </button>
    );
}
