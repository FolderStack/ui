import { PropsWithChildren } from "react";
import "./globals.css";

import { openSans } from "@/config/fonts";
import { classNames } from "@/utils";

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html>
            <body
                className={classNames(
                    openSans.variable,
                    "font-body md:flex min-h-screen max-h-screen"
                )}
            >
                {children}
            </body>
        </html>
    );
}
