"use client";
import { NoSSR, SideBar, TopBar } from "@/components";
import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { useToken } from "antd/es/theme/internal";
import { PropsWithChildren } from "react";
import "./globals.css";
import { Providers } from "./providers";

export default function RootLayout({ children }: PropsWithChildren) {
    const [, token] = useToken();
    return (
        <html lang="en">
            <body style={{ margin: 0 }}>
                <Providers>
                    <Layout
                        style={
                            {
                                background: token.colorBgBase,
                                ...LayoutStyle,
                            } as any
                        }
                    >
                        <SideBar />
                        <Layout>
                            <Header style={HeaderStyle}>
                                <NoSSR>
                                    <TopBar />
                                </NoSSR>
                            </Header>
                            <Content style={ContentStyle}>{children}</Content>
                        </Layout>
                    </Layout>
                </Providers>
            </body>
        </html>
    );
}

const LayoutStyle = {
    minHeight: "100vh",
    minWidth: "100vw",
    flexDirection: "row",
};

const HeaderStyle = {
    height: "auto",
    background: "transparent",
    paddingTop: "24px",
};

const ContentStyle = {
    marginTop: "24px",
    paddingInline: "50px",
    color: "black",
};
