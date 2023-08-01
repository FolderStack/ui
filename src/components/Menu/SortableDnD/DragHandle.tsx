import { useUser } from "@/hooks";
import { AiOutlineHolder } from "react-icons/ai";

export function DragHandle() {
    const user = useUser();

    if (!user?.isAdmin) return null;

    return <AiOutlineHolder className="menu--item-drag-handle" />;
}
