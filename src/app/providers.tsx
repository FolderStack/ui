import {
    SearchAndFilterProviders,
    TreeProvider,
    UserProvider,
    useOrg,
} from "@/hooks";
import { ThemeToken } from "@/theme";
import { ConfigProvider } from "antd";
import { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
    const org = useOrg();

    return (
        <UserProvider>
            <TreeProvider>
                <SearchAndFilterProviders>
                    <ConfigProvider theme={org?.theme ?? ThemeToken}>
                        {children}
                    </ConfigProvider>
                </SearchAndFilterProviders>
            </TreeProvider>
        </UserProvider>
    );
}
