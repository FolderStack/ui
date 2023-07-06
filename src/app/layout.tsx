import { Header, Layout, TopBar } from "@/components";
import { PropsWithChildren } from "react";
import "./globals.css";
import { Providers } from "./providers";

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en" className="h-full bg-white">
            <body className="h-full">
                <Providers>
                    <Layout>
                        <Header>
                            <TopBar />
                        </Header>
                        {children}
                    </Layout>
                </Providers>
            </body>
        </html>
    );
}
