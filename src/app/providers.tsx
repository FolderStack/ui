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
        <ConfigProvider theme={org?.theme ?? ThemeToken}>
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
