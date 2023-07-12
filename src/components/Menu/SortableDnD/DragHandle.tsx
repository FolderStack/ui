import { useUser } from "@/hooks";
import { HolderOutlined } from "@ant-design/icons";

export function DragHandle() {
    const user = useUser();

    if (!user?.isAdmin) return null;

    return <HolderOutlined className="menu--item-drag-handle" />;
}
