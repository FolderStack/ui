import { FolderData } from "@/types";
import { Image, Row } from "antd";
import { useToken } from "antd/es/theme/internal";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
import "./folder.css";

interface FolderProps {
    data: FolderData;
    table?: boolean;
}

export function Folder({ data, table: isTable = false }: FolderProps) {
    const router = useRouter();
    const [, token] = useToken();

    const handleClick = () => {
        const qs = new URL(window.location.href).search;
        router.push(`/folder/${data.id}${qs}`);
    };

    return (
        <Row
            onClick={isTable ? undefined : handleClick}
            className="folder-item"
            style={{
                background: token.colorBgContainer,
                borderRadius: token.borderRadius,
            }}
        >
            <Row className="folder-contents" justify="start">
                <Row align="top">
                    <Title
                        level={5}
                        className="folder-title"
                        onClick={isTable ? handleClick : undefined}
                    >
                        {data.name}
                    </Title>
                </Row>
                <Image
                    preview={false}
                    src="https://via.placeholder.com/200x200.png"
                    alt="image"
                    wrapperStyle={{ width: "100%" }}
                    style={{
                        objectFit: "fill",
                        borderRadius: "2px",
                        height: "100%",
                        width: "100%",
                        display: isTable ? "none" : undefined,
                    }}
                />
            </Row>
        </Row>
    );
}