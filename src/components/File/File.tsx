"use client";
import { useSelection } from "@/hooks";
import { FileData } from "@/types";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Button, ButtonGroup, Checkbox, Row, Title } from "../Elements";

const DownloadOutlined = dynamic(
    () => import("@ant-design/icons/DownloadOutlined")
);
const InfoCircleOutlined = dynamic(
    () => import("@ant-design/icons/InfoCircleOutlined")
);
const StarOutlined = dynamic(() => import("@ant-design/icons/StarOutlined"));

interface FileProps {
    data: FileData;
}

export function File({ data }: FileProps) {
    const selection = useSelection();

    const [isSelected, setIsSelected] = useState(false);

    const isSelectedInContext = useMemo(() => {
        return selection.isSelected(String(data.id));
    }, [selection, data]);

    function onCheckboxChange(val: boolean) {
        if (val) {
            selection.add(String(data.id));
        } else {
            selection.remove(String(data.id));
        }
    }

    useEffect(() => {
        setIsSelected(isSelectedInContext);
    }, [isSelectedInContext]);

    return (
        <Row
            style={{
                minWidth: "280px",
                maxWidth: "280px",
                minHeight: "320px",
                // background: token.colorBgContainer,
                // borderRadius: token.borderRadius,
                boxShadow: "0px 10px 50px -15px rgba(0,0,0,0.1)",
                border: isSelected ? "1px solid" : "1px solid transparent",
            }}
        >
            <Row style={{ padding: "16px" }} align="top" justify="start">
                <Row
                    align="middle"
                    justify="space-between"
                    style={{ width: "100%" }}
                >
                    <Row
                        style={{ gap: "12px", marginTop: "-5px" }}
                        align="middle"
                    >
                        <Checkbox
                            checked={isSelected}
                            onChange={(evt) =>
                                onCheckboxChange(evt.target.checked)
                            }
                        >
                            <Title size="h5" style={{ marginTop: "5px" }}>
                                {data.name}
                            </Title>
                        </Checkbox>
                    </Row>
                </Row>
                <Row style={{ width: "100%", justifyContent: "center" }}>
                    <Image
                        src="https://via.placeholder.com/200x200.png"
                        alt="image"
                        style={{ objectFit: "contain" }}
                    />
                </Row>
            </Row>
            <Row justify="end" style={{ width: "100%", paddingInline: "8px" }}>
                <ButtonGroup>
                    <Button icon={<DownloadOutlined />} />
                    <Button
                        icon={<StarOutlined style={{ marginTop: "3px" }} />}
                    />
                    <Button
                        icon={
                            <InfoCircleOutlined style={{ marginTop: "3px" }} />
                        }
                    />
                </ButtonGroup>
            </Row>
        </Row>
    );
}
