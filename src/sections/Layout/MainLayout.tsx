"use client";
import { NoSSR, SideBar, TopBar } from "@/components";
import { Layout } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import { useToken } from "antd/es/theme/internal";
import { MainLayoutProviders } from "./Providers";

export function withMainLayout(Component: React.FC) {
    return function ComponentWithMainLayout() {
        return (
            <MainLayout>
                <Component />
            </MainLayout>
        );
    };
}

export function MainLayout({ children }: React.PropsWithChildren) {
    const [, token] = useToken();

    return (
        <Layout
            style={{
                background: token.colorBgBase,
                ...LayoutStyle,
            }}
        >
            <SideBar />
            <Layout>
                <NoSSR>
                    <MainLayoutProviders>
                        <Header style={HeaderStyle}>
                            <TopBar />
                        </Header>
                        <Content style={ContentStyle}>{children}</Content>
                        <Footer></Footer>
                    </MainLayoutProviders>
                </NoSSR>
            </Layout>
        </Layout>
    );
}

const LayoutStyle = {
    minHeight: "100vh",
    minWidth: "100vw",
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
