import { FolderData } from "@/types";
import { Row } from "antd";
import { useToken } from "antd/es/theme/internal";
import Title from "antd/es/typography/Title";
import { useRouter } from "next/navigation";
import { BiSolidFolder } from "react-icons/bi";
import "./folder.css";

interface FolderProps {
    data: FolderData;
    table?: boolean;
}

export function Folder({ data, table: isTable = false }: FolderProps) {
    const [, theme] = useToken();
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
                    <BiSolidFolder
                        style={{
                            objectFit: "fill",
                            display: isTable ? undefined : "none",
                        }}
                    />
                    <Title
                        level={5}
                        className="folder-title"
                        onClick={isTable ? handleClick : undefined}
                    >
                        {data.name}
                    </Title>
                </Row>
                <BiSolidFolder
                    style={{
                        color: theme.colorIcon,
                        height: "60%",
                        width: "100%",
                        display: isTable ? "none" : undefined,
                    }}
                />
                {/* <Image
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
                /> */}
            </Row>
        </Row>
    );
}
