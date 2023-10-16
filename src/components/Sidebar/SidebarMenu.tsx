"use client";
import { Node } from "@/utils/buildTree";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarMenuItem } from "./SidebarMenuItem";

interface SidebarMenuProps {
    tree: Node[];
}

export function SidebarMenu({ tree }: SidebarMenuProps) {
    const current = useParams().folderId;

    const stored =
        typeof window === "undefined"
            ? "[]"
            : window.localStorage.getItem("expandedNodes");

    const initialExpandedNodes = stored
        ? new Set<string>(JSON.parse(stored))
        : new Set<string>();

    const [expandedNodes, setExpandedNodes] =
        useState<Set<string>>(initialExpandedNodes);

    useEffect(() => {
        if (typeof window !== "undefined") {
            window.localStorage.setItem(
                "expandedNodes",
                JSON.stringify(Array.from(expandedNodes))
            );
        }
    }, [expandedNodes]);

    const renderNodes = (
        nodes: Node[],
        current: string | null
    ): JSX.Element[] => {
        return nodes.map((node) => (
            <div key={node.id}>
                <SidebarMenuItem
                    node={node}
                    current={current}
                    expanded={expandedNodes.has(node.id)}
                    toggleExpand={() => {
                        const newSet = new Set(expandedNodes);
                        if (newSet.has(node.id)) {
                            newSet.delete(node.id);
                        } else {
                            newSet.add(node.id);
                        }
                        setExpandedNodes(newSet);
                    }}
                />
                {node.tree &&
                    node.tree.length > 0 &&
                    expandedNodes.has(node.id) && (
                        <div className="ml-4 my-1">
                            {renderNodes(node.tree, current)}
                        </div>
                    )}
            </div>
        ));
    };

    return (
        <div className="flex flex-col select-none w-full">
            {renderNodes(
                tree.filter((t) => t.name !== "root") ?? [],
                String(current)
            )}
        </div>
    );
}
