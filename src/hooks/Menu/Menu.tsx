import { Tree } from "@/utils";
import { useParams } from "next/navigation";
import {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useTree } from "../PageData";
import {
    IMenuContext,
    MenuDropdownToggleEvent,
    MenuItemClickEvent,
    OpenState,
} from "./type";

const MenuContext = createContext<IMenuContext>({
    active: null,
    activePath: [],
    open: [],
    setOpen() {
        //
    },
    handleClick(e: MenuItemClickEvent | MenuDropdownToggleEvent) {},
    getParent(v: string) {
        return "";
    },
});

interface MenuProps extends PropsWithChildren {
    initialOpenState?: OpenState;
}

export function MenuProvider({ initialOpenState = [], children }: MenuProps) {
    const menuTree = useTree();
    const [open, setOpen] = useState<OpenState>(initialOpenState);
    const [active, setActive] = useState<string | null>(null);
    const [activePath, setActivePath] = useState<string[]>([]);
    const params = useParams();

    console.log("MenuProvider", {
        open,
        active,
        activePath,
        params,
    });

    const items = useMemo(() => menuTree.tree ?? [], [menuTree]);

    function handleClick(e: MenuItemClickEvent | MenuDropdownToggleEvent) {
        if (e.type === "open-toggle") {
            const openArr = [...open];
            const { id, parent } = e;

            const pIdx = openArr.findIndex(([p]) => p === parent);
            if (pIdx === -1) {
                openArr.push([parent, [id]]);
            } else {
                const parentItems = [...openArr[pIdx][1]];
                const itemIdx = parentItems.findIndex((i) => i === id);
                if (itemIdx !== -1) {
                    parentItems.splice(itemIdx, 1);
                } else {
                    parentItems.push(id);
                }
                openArr[pIdx][1] = parentItems;
            }

            setOpen(openArr);
        }
    }

    const buildTree = useCallback(
        (tree: Tree, arr = items.children) => {
            for (const item of arr) {
                const itemTree = new Tree(tree);
                itemTree.addLeaf(item.id);
                tree.addNode(itemTree);
                buildTree(itemTree, item.children ?? []);
            }
        },
        [items]
    );

    const tree = useMemo(() => {
        const root = new Tree();
        buildTree(root);
        return root;
    }, [buildTree]);

    const setOpenWithPath = useCallback((path: string[], override = false) => {
        let _open: any = [];
        for (let i = 0; i < path.length; i++) {
            _open.push([path[i - 1] ?? "root", [path[i]]]);
        }
        if (override) {
            setOpen(_open);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getParent = useCallback(
        (folderId: string) => {
            debugger;
            const path = tree.getPath(folderId) as string[];
            if (path && path.length > 0) {
                path.pop();
                return path.pop();
            }
        },
        [tree]
    );

    useEffect(() => {
        debugger;
        const folderId = params?.folderId ?? null;
        if (folderId) {
            setActive(folderId);
        }
    }, [params]);

    useEffect(() => {
        const path = tree.getPath(active);

        if (path) {
            setOpenWithPath(path);
        }
    }, [active, tree, setOpenWithPath]);

    useEffect(() => {
        if (active) {
            const path = tree.getPath(active);
            if (path) setActivePath(path);
        }
    }, [active, tree]);

    return (
        <MenuContext.Provider
            value={{
                open,
                setOpen,
                active,
                activePath,
                handleClick,
                getParent,
            }}
        >
            {children}
        </MenuContext.Provider>
    );
}

export function useMenu() {
    return useContext(MenuContext);
}
