"use client";

import { UserProvider } from "@/hooks";
import { ThemeToken } from "@/theme";
import { ConfigProvider } from "antd";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider theme={ThemeToken}>
            <UserProvider>{children}</UserProvider>
        </ConfigProvider>
    );
}
