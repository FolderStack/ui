// SidebarMenuItem.tsx
import { classNames } from "@/utils";
import { Node } from "@/utils/buildTree";
import { useRouter } from "next/navigation";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

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
    const router = useRouter();

    return (
        <div
            className={classNames(
                "my-1 rounded-sm flex justify-between items-center cursor-pointer py-1 px-3 ",
                node.id === current ? "bg-blue-200" : ""
            )}
        >
            <div
                className="cursor-pointer flex-1 truncate"
                onClick={() => {
                    router.push(`/folder/${node.id}`);
                }}
            >
                {node.name}
            </div>
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
