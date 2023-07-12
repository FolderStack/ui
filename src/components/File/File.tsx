import { useSelection } from "@/hooks";
import { FileData } from "@/types";
import {
    DownloadOutlined,
    InfoCircleOutlined,
    StarOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Image, Row } from "antd";
import ButtonGroup from "antd/es/button/button-group";
import { useToken } from "antd/es/theme/internal";
import Title from "antd/es/typography/Title";
import { useEffect, useMemo, useState } from "react";

interface FileProps {
    data: FileData;
}

export function File({ data }: FileProps) {
    const selection = useSelection();
    const [, token] = useToken();

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
                minHeight: "340px",
                background: token.colorBgContainer,
                borderRadius: token.borderRadius,
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
                            <Title
                                level={5}
                                style={{ marginTop: "5px", fontSize: 14 }}
                            >
                                {data.name}
                            </Title>
                        </Checkbox>
                    </Row>
                </Row>
                <Row style={{ width: "100%", justifyContent: "center" }}>
                    <Image
                        src="https://via.placeholder.com/200x200.png"
                        alt="image"
                        style={{ objectFit: "contain", borderRadius: "2px" }}
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
