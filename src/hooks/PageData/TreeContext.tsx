"use client";
import { BasicTree } from "@/types";
import { gotoLogin } from "@/utils";
import {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { useBoolean } from "../useBoolean";

interface TreeContext {
    tree: BasicTree;
    isLoading: boolean;
    reload(): void;
    updateOrder(id: string, items: string[]): void;
}

const defaultTree = {
    id: "ROOT",
    children: [],
};

const TreeContext = createContext<TreeContext>({
    tree: defaultTree,
    isLoading: false,
    reload() {
        //
    },
    updateOrder(id: string, items: string[]) {
        //
    },
});

export function TreeProvider({ children }: PropsWithChildren) {
    const [tree, setTree] = useState<BasicTree>(defaultTree);
    const [isLoading, loading] = useBoolean(false);

    async function fetchTree() {
        const res = await fetch(`/api/tree`);
        if (res.ok) {
            const data = await res.json();
            return data;
        } else if (res.status === 401) {
            gotoLogin();
        }
    }

    const updateOrder = (id: string, newOrder: string[]) => {
        const updateNode = (node: BasicTree): any => {
            if (node.id === id) {
                // Found the node to update
                return {
                    ...node,
                    children: node.children.sort((a, b) => {
                        // Compare function assumes newOrder is an array of IDs in the desired order
                        const aOrder = newOrder.indexOf(a.id);
                        const bOrder = newOrder.indexOf(b.id);
                        return aOrder - bOrder;
                    }),
                };
            } else if (node.children) {
                // Recursively update children
                return {
                    ...node,
                    children: node.children.map(updateNode),
                };
            } else {
                // Node doesn't have children, return as is
                return node;
            }
        };
        // Update the state
        setTree((state) => updateNode(state));
    };

    const reload = useCallback(() => {
        loading.on();
        fetchTree()
            .then((result) => {
                if (result.id && result.children) {
                    setTree(result);
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
        <TreeContext.Provider value={{ tree, isLoading, reload, updateOrder }}>
            {children}
        </TreeContext.Provider>
    );
}

export function useTree() {
    return useContext(TreeContext);
}
