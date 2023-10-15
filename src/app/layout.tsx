"use client";
import { PropsWithChildren } from "react";
import "./globals.css";

import { openSans } from "@/config/fonts";
import { classNames } from "@/utils";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html>
            <SessionProvider>
                <body
                    className={classNames(
                        openSans.variable,
                        "font-body md:flex min-h-screen max-h-screen"
                    )}
                >
                    {children}
                </body>
            </SessionProvider>
        </html>
    );
}
