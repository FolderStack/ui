import { useMemo } from "react";
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

export function ToastIcon({ type }: { type: "success" | "error" }) {
    const Icon = useMemo(() => {
        if (type === "error") {
            return (
                <AiOutlineCloseCircle
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                />
            );
        } else if (type === "success") {
            return (
                <AiOutlineCheckCircle
                    className="h-6 w-6 text-green-800"
                    aria-hidden="true"
                />
            );
        }
    }, [type]);

    return Icon;
}