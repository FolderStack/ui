import { useMenu, useTree } from "@/hooks";
import { SortableTree } from "dnd-kit-sortable-tree";
import { useCallback, useMemo } from "react";
import { SortableTreeItem } from "./SortableDnD/SortableTreeContext";
import "./menu.css";

export function SideMenu() {
    const menu = useMenu();
    const { tree } = useTree();

    function onDragChange(items: any) {
        menu.setOrder(items);
    }

    const attachOpenStateToTree = useCallback(
        (currTree: any, parent: any = null) => {
            const nodes = [];
            for (const node of currTree) {
                node.isOpen = false;

                const parentIdx = menu.open.findIndex(
                    ([p]) => p === (parent?.id ?? "ROOT")
                );
                if (parentIdx !== -1) {
                    node.isOpen = menu.open[parentIdx][1].includes(node.id);
                }

                node.isVisible = !(
                    parent?.isOpen === false || parent?.isVisible === false
                );

                node.children = attachOpenStateToTree(node.children, node);
                nodes.push(node);
            }
            return nodes;
        },
        [menu.open]
    );

    const items = useMemo(() => {
        return attachOpenStateToTree(tree);
    }, [attachOpenStateToTree, tree]);

    return (
        <div className="menu--root-container">
            <SortableTree
                items={items}
                onItemsChanged={onDragChange}
                TreeItemComponent={SortableTreeItem as any}
            />
        </div>
    );
}
