"use client";
import { BasicTree } from "@/types";
import { gotoLogin } from "@/utils";
import React, {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { IdTree } from "../Menu";
import { useBoolean } from "../useBoolean";

interface TreeContext {
    tree: BasicTree[];
    isLoading: boolean;
    reload(): void;
    updateOrder(items: IdTree[]): void;
    updateItem(id: string, update: any): void;
    getNameFromId(id?: string): string | null;
}

const TreeContext = createContext<TreeContext>({
    tree: [],
    isLoading: false,
    reload() {
        //
    },
    updateOrder(items: IdTree[]) {
        //
    },
    updateItem(id: string, update: any) {
        //
    },
    getNameFromId(id: string) {
        return null;
    },
});

function TreeProviderComponent({ children }: PropsWithChildren) {
    const [tree, setTree] = useState<BasicTree[]>([]);
    const [isLoading, loading] = useBoolean(false);

    async function fetchTree() {
        const res = await fetch(`/api/tree`);
        if (res.ok) {
            if (res.status === 401) {
                gotoLogin();
                return;
            }

            const data = await res.json();
            return data;
        } else if (res.status === 401) {
            gotoLogin();
        }
    }

    // Helper function to find a node and its parent in the tree
    const findNode = (
        node: BasicTree | null,
        id: string,
        parent: BasicTree | null = null
    ): { node: BasicTree | null; parent: BasicTree | null } => {
        if (!node) {
            return { node: null, parent: null };
        } else if (node.id === id) {
            return { node, parent };
        } else {
            for (let child of node.children || []) {
                let found = findNode(child, id, node);
                if (found.node) {
                    return found;
                }
            }
            return { node: null, parent: null };
        }
    };

    const buildTree = (node: BasicTree): BasicTree => {
        if (!node) return node;
        return {
            ...node,
            // build trees for children as well
            children: node.children.map((child) => buildTree(child)),
        };
    };

    const flattenOrder = (order: BasicTree[]): string[] => {
        return order.reduce((acc: string[], curr: BasicTree) => {
            acc.push(curr.id);
            if (curr.children) {
                acc = acc.concat(flattenOrder(curr.children));
            }
            return acc;
        }, []);
    };

    const updateNodeOrder = (node: BasicTree, order: string[]): BasicTree => {
        if (!node.children) return node;

        // Sort and update children recursively
        const sortedChildren = node.children
            .sort((a, b) => {
                const aOrder = order.findIndex((id) => id === a.id);
                const bOrder = order.findIndex((id) => id === b.id);
                return aOrder - bOrder;
            })
            .map((child) => updateNodeOrder(child, order));

        // Return new node with sorted children
        return {
            ...node,
            children: sortedChildren,
        };
    };

    const updateOrder = (newOrder: BasicTree[]) => {
        // Flatten newOrder for sorting
        const flatOrder = flattenOrder(newOrder);

        // Build new tree
        const newTree = newOrder.map((node) => buildTree(node));

        // Recursively update nodes
        const updatedTree = newTree.map((node) =>
            updateNodeOrder(node, flatOrder)
        );

        // Update the state
        setTree(updatedTree as any);
    };

    const updateNode = (
        id: string,
        update: any,
        node: BasicTree
    ): BasicTree => {
        if (node.id === id) {
            return { ...node, ...update };
        }

        if (node.children) {
            return {
                ...node,
                children: node.children.map((child) =>
                    updateNode(id, update, child)
                ),
            };
        } else {
            return node;
        }
    };

    const updateItem = (id: string, update: any) => {
        const roots = tree.map((root) => updateNode(id, update, root));
        setTree(roots);
    };

    const getNameFromId = (id: string) => {
        if (!id) return "Home";
        const nodes = tree
            .map((root) => findNode(root, id))
            .filter((v) => !!v.node);
        if (nodes[0]) return nodes[0].node?.name ?? null;
        return null;
    };

    const reload = useCallback(() => {
        loading.on();
        fetchTree()
            .then((result) => {
                if (result?.id && result?.children) {
                    updateOrder(result.children);
                }
            })
            .finally(() => {
                loading.off();
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        reload();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <TreeContext.Provider
            value={{
                tree,
                isLoading,
                reload,
                getNameFromId,
                updateOrder,
                updateItem,
            }}
        >
            {children}
        </TreeContext.Provider>
    );
}

export const TreeProvider = React.memo(TreeProviderComponent);

export function useTree() {
    return useContext(TreeContext);
}
