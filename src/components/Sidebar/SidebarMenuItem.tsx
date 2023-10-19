// SidebarMenuItem.tsx
import { useMoveOnDrop } from "@/hooks/useMoveOnDrop";
import { IFolder } from "@/services/db/models";
import { classNames } from "@/utils";
import { Node } from "@/utils/buildTree";
import Link from "next/link";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useDraggingState } from "../Drag/DragContext";
import { useDragAndDrop } from "../Drag/useDragAndDrop";

interface SidebarMenuItemProps {
    node: Node;
    current: string | null;
    expanded: boolean;
    toggleExpand: () => void;
}

export const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
    node,
    current,
    expanded,
    toggleExpand,
}) => {
    const { onDrop } = useMoveOnDrop(node.id);
    const { dragId } = useDraggingState();
    const { dropRef, isOver } = useDragAndDrop(node as IFolder, onDrop);

    // Can't use isBeingDragged from useDragAndDrop due to separate refs being used.
    const isBeingDragged = dragId === node.id;

    return (
        <div
            ref={dropRef}
            className={classNames(
                "my-1 rounded-sm flex justify-between items-center cursor-pointer py-1 px-3 border-2",
                node.id === current ? "bg-secondary-200" : "",
                isOver && !isBeingDragged
                    ? "border-white"
                    : "border-transparent"
            )}
        >
            <Link
                className={classNames(
                    "cursor-pointer flex-1 truncate text-white font-medium",
                    isOver && !isBeingDragged ? "opacity-60" : ""
                )}
                href={`/folder/${node.id}`}
            >
                {node.name}
            </Link>
            {node.tree && node.tree.length > 0 && (
                <div
                    className="w-4 h-4 flex items-center justify-center"
                    onClick={toggleExpand}
                >
                    {expanded ? <FiChevronDown /> : <FiChevronRight />}
                </div>
            )}
        </div>
    );
};
