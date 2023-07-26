"use client";

import { useOrg } from "@/hooks";
import { Button, Image, Row } from "antd";
import Sider from "antd/es/layout/Sider";
import React, { forwardRef, useMemo, useState } from "react";
import { RxWidth } from "react-icons/Rx";
import { Resizable } from "react-resizable";
import { SideMenu } from "../Menu";
import { NoSSR } from "../NoSSR";
import { SearchBar } from "../SearchBar";
import "./sidebar.css";

const DragHandle = forwardRef(function DragHandleComponent(props, ref: any) {
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
                    position: "absolute",
                    bottom: 32,
                    right: -16,
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

    const logo = useMemo(() => org?.config?.logo, [org]);

    return (
        <Resizable
            handle={<DragHandle />}
            width={width}
            axis="x"
            onResize={(_, { size }) => {
                setWidth(size.width);
            }}
            minConstraints={[INITIAL_WIDTH, -1]}
        >
            <Sider
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
                        }}
                    />
                ) : (
                    <div style={{ height: "24px" }} />
                )}
                <Row style={{ padding: "0px 28px 12px 28px" }}>
                    <SearchBar />
                </Row>
                <NoSSR>
                    <SideMenu />
                </NoSSR>
            </Sider>
        </Resizable>
    );
}

export const SideBar = React.memo(SideBarComponent);
