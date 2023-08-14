"use client";
import { NoSSR, PageLoader, SideBar, TopBar } from "@/components";
import {
    MenuProvider,
    OrgProvider,
    PageLoadingConsumer,
    PageLoadingProvider,
} from "@/hooks";
import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { useToken } from "antd/es/theme/internal";
import { PropsWithChildren } from "react";
import "./globals.css";
import { Head } from "./head";
import { Providers } from "./providers";

export default function RootLayout({ children }: PropsWithChildren) {
    const [, token] = useToken();

    return (
        <PageLoadingProvider>
            <OrgProvider>
                <html lang="en">
                    <Head />
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
                                <MenuProvider>
                                    <PageLoadingConsumer>
                                        {({ isLoading }) => {
                                            if (isLoading)
                                                return <PageLoader />;
                                            return (
                                                <NoSSR>
                                                    <SideBar />
                                                    <Layout
                                                        style={{
                                                            height: "100vh",
                                                        }}
                                                    >
                                                        <Header
                                                            style={HeaderStyle}
                                                        >
                                                            <TopBar />
                                                        </Header>
                                                        <Content
                                                            style={ContentStyle}
                                                            className="content"
                                                        >
                                                            {children}
                                                        </Content>
                                                    </Layout>
                                                </NoSSR>
                                            );
                                        }}
                                    </PageLoadingConsumer>
                                </MenuProvider>
                            </Layout>
                        </Providers>
                    </body>
                </html>
            </OrgProvider>
        </PageLoadingProvider>
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
    height: "calc(100vh - 210px)",
    paddingBottom: "80px",
    overflow: "scroll",
};
