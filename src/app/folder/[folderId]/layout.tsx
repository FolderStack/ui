import { Content } from "@/components";
import { PropsWithChildren } from "react";

export default function PageLayout({ children }: PropsWithChildren) {
    return <Content style={ContentStyle}>{children}</Content>;
}

const ContentStyle = {
    marginTop: "24px",
    paddingInline: "50px",
    color: "black",
};
