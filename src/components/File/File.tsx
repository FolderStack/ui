import { useSelection } from "@/hooks";
import { FileData } from "@/types";
import { Button, Checkbox, Image, Row } from "antd";
import ButtonGroup from "antd/es/button/button-group";
import { useToken } from "antd/es/theme/internal";
import Title from "antd/es/typography/Title";
import { useEffect, useMemo, useState } from "react";
import {
    AiOutlineDownload,
    AiOutlineInfoCircle,
    AiOutlineStar,
} from "react-icons/ai";

interface FileProps {
    data: FileData;
    table?: boolean;
}

export function File({ data, table: isTable = false }: FileProps) {
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

    const thumbnail = useMemo(() => {
        if (data.thumbnail) {
            return data.thumbnail
                .replace(/\/\//gi, "/")
                .replace("https:/", "https://");
        }
        return "https://via.placeholder.com/200x200.png";
    }, [data.thumbnail]);

    const containerStyle = useMemo(() => {
        if (isTable) {
            return {};
        }
        return {
            minWidth: "280px",
            maxWidth: "280px",
            minHeight: "340px",
            background: token.colorBgContainer,
            borderRadius: token.borderRadius,
            boxShadow: "0px 10px 50px -15px rgba(0,0,0,0.1)",
            border: isSelected ? "1px solid" : "1px solid transparent",
        };
    }, [isTable, token, isSelected]);

    return (
        <Row style={containerStyle}>
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
                        src={thumbnail}
                        alt="image"
                        style={{ objectFit: "contain", borderRadius: "2px" }}
                    />
                </Row>
            </Row>
            <Row justify="end" style={{ width: "100%", paddingInline: "8px" }}>
                <ButtonGroup style={{ alignItems: "center" }}>
                    <Button
                        href={data.asset ?? "#"}
                        target="_blank"
                        rel="noopener nofollow"
                        icon={<AiOutlineDownload className="ai-icon" />}
                    />
                    <Button
                        icon={
                            <AiOutlineInfoCircle
                                style={{ marginTop: "3px" }}
                                className="ai-icon"
                            />
                        }
                    />
                    <Button
                        icon={
                            <AiOutlineStar
                                style={{ marginTop: "3px" }}
                                className="ai-icon"
                            />
                        }
                    />
                </ButtonGroup>
            </Row>
        </Row>
    );
}
