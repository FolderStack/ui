"use client";
import { classNames } from "@/utils";
import Link from "next/link";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface ButtonProps
    extends DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    to?: string;
    primary?: boolean;
    secondary?: boolean;
    link?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
}

export function Button({
    children,
    to,
    primary,
    secondary,
    link,
    loading,
    icon,
    ...props
}: ButtonProps) {
    if (loading) {
        props.disabled = true;
    }

    const classes: string[] = [];

    if (!link && !icon) {
        classes.push("px-6 py-3 rounded font-semibold");
    }

    if (loading) {
        classes.push("animate-pulse");
    }

    if (!to || !props.disabled) {
        if (primary) {
            classes.push("bg-primary-400 text-white");
        } else if (secondary) {
            classes.push("bg-secondary-400 text-white");
        } else if (link) {
            classes.push("bg-transparent");
        }
    }

    if (props.disabled) {
        if (!to) {
            classes.push(
                "disabled:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            );
        } else {
            classes.push(
                "text-white bg-gray-500 opacity-50 cursor-not-allowed"
            );
        }
    } else {
        classes.push("hover:opacity-80");
    }

    const className = classNames(props.className || "", ...classes);

    const eleProps = {
        className,
    };

    if (!to) {
        return (
            <button {...props} {...eleProps}>
                {icon || children}
            </button>
        );
    }

    return (
        <Link
            href={to || "#"}
            {...(props as any)}
            {...eleProps}
            prefetch
            onClick={(e) => {
                if (props.disabled) {
                    e.preventDefault();
                }
                if (props.onClick) props.onClick(e as any);
            }}
        >
            {icon || children}
        </Link>
    );
}
