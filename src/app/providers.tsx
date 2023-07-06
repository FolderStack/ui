import { TreeProvider, UserProvider } from "@/hooks";
import { MainLayout } from "@/sections";
import { PropsWithChildren } from "react";

export function Providers({ children }: PropsWithChildren) {
    return (
        <UserProvider>
            <TreeProvider>
                <MainLayout>{children}</MainLayout>
            </TreeProvider>
        </UserProvider>
    );
}
