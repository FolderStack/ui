"use client";

import { Button } from "antd";
import Sider from "antd/es/layout/Sider";
import { forwardRef, useState } from "react";
import { RxWidth } from "react-icons/Rx";
import { Resizable } from "react-resizable";
import { SideMenu } from "../Menu";
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

export function SideBar() {
    const [width, setWidth] = useState(280);

    return (
        <Resizable
            handle={<DragHandle />}
            width={width}
            axis="x"
            onResize={(_, { size }) => {
                setWidth(size.width);
            }}
            minConstraints={[280, -1]}
        >
            <Sider
                style={{ background: "white", position: "relative" }}
                width={width}
            >
                <SideMenu />
            </Sider>
        </Resizable>
    );
}
