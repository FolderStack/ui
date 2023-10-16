"use client";
import { PropsWithChildren } from "react";
import "./globals.css";

import { DragProvider } from "@/components/Drag/DragContext";
import { openSans } from "@/config/fonts";
import { classNames } from "@/utils";
import { SessionProvider } from "next-auth/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html>
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
