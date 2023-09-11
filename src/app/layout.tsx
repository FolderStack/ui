"use client";
import { NoSSR, PageLoader, SideBar, TopBar } from "@/components";
import { MenuProvider, OrgProvider, PageLoadingProvider } from "@/hooks";
import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { useToken } from "antd/es/theme/internal";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import "./globals.css";
import { Head } from "./head";
import { Providers } from "./providers";

export default function RootLayout({ children }: PropsWithChildren) {
    const [, token] = useToken();
    const path = usePathname();

    if (path.startsWith("/auth/error")) {
        return (
            <html lang="en">
                <Head title="Error" />
                <body>{children}</body>
            </html>
        );
    }

    return (
        <PageLoadingProvider>
            <OrgProvider>
                <html lang="en">
                    <Head />
                    <body style={{ margin: 0 }}>
                        <PageLoader />
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
                                    <NoSSR>
                                        <SideBar />
                                        <Layout
                                            style={{
                                                height: "100vh",
                                            }}
                                        >
                                            <Header style={HeaderStyle}>
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
    height: "100%",
    paddingBottom: "80px",
    overflow: "scroll",
};
