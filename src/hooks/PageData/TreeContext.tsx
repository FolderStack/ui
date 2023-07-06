"use client";
import { Tree } from "@/types";
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
    tree: Tree;
    isLoading: boolean;
    reload(): void;
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
});

export function TreeProvider({ children }: PropsWithChildren) {
    const [tree, setTree] = useState<Tree>(defaultTree);
    const [isLoading, loading] = useBoolean(false);

    async function fetchTree() {
        const response = await fetch(`/api/tree`);
        const data = await response.json();
        return data;
    }

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
        <TreeContext.Provider value={{ tree, isLoading, reload }}>
            {children}
        </TreeContext.Provider>
    );
}

export function useTree() {
    return useContext(TreeContext);
}
