"use client";

import { ActionResponse } from "@/types/server-actions";
import { useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useToast } from "./ToastProvider";

export function FormStatusToast({
    status,
    message,
    nonce,
}: Partial<ActionResponse> & { nonce: string }) {
    const actionStatus = useFormStatus();
    const toast = useToast();

    useEffect(() => {
        // Check if pending has changed to false
        if (!actionStatus.pending && status && message) {
            toast.add(status, message, status, nonce);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionStatus.pending]);

    return null; // render nothing
}
