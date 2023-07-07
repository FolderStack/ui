import { SearchAndFilterProviders, TreeProvider, UserProvider } from "@/hooks";
import { ThemeToken } from "@/theme";
import { ConfigProvider } from "antd";
import { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
    return (
        <ConfigProvider theme={ThemeToken}>
            <UserProvider>
                <TreeProvider>
                    <SearchAndFilterProviders>
                        {children}
                    </SearchAndFilterProviders>
                </TreeProvider>
            </UserProvider>
        </ConfigProvider>
    );
}
