import { Header, TopBar } from "@/components";
import { Shell } from "@/sections";
import { PropsWithChildren } from "react";
import "./globals.css";
import { Providers } from "./providers";

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en" className="h-full bg-white">
            <body className="h-full">
                <Providers>
                    <Shell>
                        <Header>
                            <TopBar />
                        </Header>
                        {children}
                    </Shell>
                </Providers>
            </body>
        </html>
    );
}
