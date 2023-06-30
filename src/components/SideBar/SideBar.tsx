"use client";
import Sider from "antd/es/layout/Sider";
import { useToken } from "antd/es/theme/internal";

export function SideBar() {
    const [, token] = useToken();

    return (
        <Sider style={{ background: "white" }} width={280}>
            Sider
        </Sider>
    );
}
