import { ElementProps } from "@/types/element-props";
import { classNames } from "@/utils";
import React from "react";

interface InputProps extends ElementProps<HTMLInputElement> {
    error?: string;

    /**
     * This is useful for password input fields that need a
     * hidden username field next to it.
     */
    'data-hidden-username'?: string;
}

export function Input(props: InputProps) {

    // All default styles that always apply
    const baseClasses = "px-2 w-full block border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset focus:outline-none focus:ring-2  placeholder:text-gray-400 sm:text-sm sm:leading-6"

    const borderClasses = props.error === 'true' ? 
        // Error border/ring styles
        "ring-red-500 focus:border-red-500 focus:ring-red-500" : 
        // Usual border/ring styles
        "ring-secondary-400  focus:border-secondary-400 focus:ring-secondary-400"

    const disabledClasses = props.disabled ? "disabled:cursor-not-allowed disabled:bg-gray-100" : ""

    return (
        <>
            {props['data-hidden-username'] === 'true' ? <input type="hidden" name="_hidden_username" autoComplete="username" /> : null}
            <input
                {...props}
                className={classNames(
                    disabledClasses,
                    borderClasses,
                    baseClasses,
                    props.className ?? ""
                )}
            />
        </>
    );
}
