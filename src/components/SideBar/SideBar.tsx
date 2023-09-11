"use client";

import { useOrg } from "@/hooks";
import { Button, Image, Row } from "antd";
import Sider from "antd/es/layout/Sider";
import { useRouter } from "next/navigation";
import React, { forwardRef, useMemo, useRef, useState } from "react";
import { RxWidth } from "react-icons/rx";
import { Resizable } from "react-resizable";
import { SideMenu } from "../Menu";
import { SearchBar } from "../SearchBar";
import "./sidebar.css";

const DragHandle = forwardRef(function DragHandleComponent(
    props: any,
    ref: any
) {
    console.log("side drag handle", props, ref);
    const dragProps: any = {
        ...props,
    };

    delete dragProps.handleAxis;

    return (
        <span {...dragProps} ref={ref}>
            <Button
                icon={<RxWidth style={{ marginTop: 4 }} />}
                className="resize-button"
                style={{
                    position: "fixed",
                    bottom: 32,
                    left: (props as any).width - 16,
                    borderRadius: 1000,
                }}
            />
        </span>
    );
});

const INITIAL_WIDTH = 320;

function SideBarComponent() {
    const org = useOrg();
    const [width, setWidth] = useState(INITIAL_WIDTH);
    const router = useRouter();
    const siderRef = useRef(null);

    const logo = useMemo(() => org?.config?.logo, [org]);

    function goHome() {
        router.push("/");
    }

    return (
        <Resizable
            handle={<DragHandle {...{ width }} />}
            width={width}
            axis="x"
            onResize={(_, { size }) => {
                setWidth(size.width);
            }}
            minConstraints={[INITIAL_WIDTH, -1]}
        >
            <Sider
                ref={siderRef}
                style={{ background: "white", position: "relative" }}
                width={width}
                className="sider--container"
            >
                {logo && typeof logo === "string" ? (
                    <Image
                        className="logo"
                        alt="logo"
                        src={logo}
                        width={"100%"}
                        preview={false}
                        style={{
                            padding: "24px 32px 24px 32px",
                            cursor: "pointer",
                        }}
                        onClick={goHome}
                    />
                ) : (
                    <div style={{ height: "24px" }} />
                )}
                <Row style={{ padding: "0px 28px 12px 28px" }}>
                    <SearchBar />
                </Row>
                <SideMenu {...{ siderRef }} />
            </Sider>
        </Resizable>
    );
}

export const SideBar = React.memo(SideBarComponent);
