"use client";
import { PropsWithChildren } from "react";
import "./globals.css";

import { DragProvider } from "@/components/Drag/DragContext";
import { openSans } from "@/config/fonts";
import { Theme } from "@/theme";
import { classNames } from "@/utils";
import { SessionProvider } from "next-auth/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html>
            <head>
                <style>
                    {`:root {
                    --color-primary-200: ${Theme.primary};
                    --color-primary-300: ${Theme.primary};
                    --color-primary-400: ${Theme.primary};
                    --color-primary: ${Theme.primary};
                    --color-primary-600: ${Theme.primary};
                    --color-primary-700: ${Theme.primary};
                    --color-primary-800: ${Theme.primary};

                    --color-secondary-200: ${Theme.secondary};
                    --color-secondary-300: ${Theme.secondary};
                    --color-secondary-400: ${Theme.secondary};
                    --color-secondary: ${Theme.secondary};
                    --color-secondary-600: ${Theme.secondary};
                    --color-secondary-700: ${Theme.secondary};
                    --color-secondary-800: ${Theme.secondary};
                `}
                </style>
            </head>
            <SessionProvider>
                <DndProvider backend={HTML5Backend}>
                    <DragProvider>
                        <body
                            className={classNames(
                                openSans.variable,
                                "font-body md:flex min-h-screen max-h-screen"
                            )}
                        >
                            {children}
                        </body>
                    </DragProvider>
                </DndProvider>
            </SessionProvider>
        </html>
    );
}
