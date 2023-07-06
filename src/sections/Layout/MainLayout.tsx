import { Layout, SideBar } from "@/components";
import { MainLayoutProviders } from "./Providers";

export function MainLayout({ children }: React.PropsWithChildren) {
    return (
        <Layout style={LayoutStyle}>
            <MainLayoutProviders>
                <SideBar />
                {children}
            </MainLayoutProviders>
        </Layout>
    );
}

const LayoutStyle = {
    minHeight: "100vh",
    minWidth: "100vw",
};
