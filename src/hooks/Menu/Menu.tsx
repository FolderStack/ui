import { config } from "@/config";
import { BasicTree } from "@/types";
import { Tree, gotoLogin } from "@/utils";
import useMessage from "antd/es/message/useMessage";
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
import { useRequestHeaders } from "../useRequestHeaders";
import {
    IMenuContext,
    IdTree,
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
    setOrder(items: IdTree[]) {
        //
    },
    transitioningItem: null,
    setTransitioningItem() {
        //
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
    const [messageApi, contextHolder] = useMessage();
    const [items, setItems] = useState<BasicTree[]>(menuTree.tree ?? []);
    const [transitioningItem, setTransitioningItem] = useState<string | null>(
        null
    );

    const params = useParams();
    const getHeaders = useRequestHeaders();

    useEffect(() => {
        setItems(menuTree.tree ?? []);
    }, [menuTree.tree]);

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
        (tree: Tree, arr = items) => {
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
            _open.push([path[i - 1] ?? "ROOT", [path[i]]]);
        }
        if (override) {
            setOpen(_open);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setOpenWithId = useCallback(
        (id = active, override = false) => {
            const path = tree.getPath(id);
            if (path) {
                setOpenWithPath(path, override);
            }
        },
        [active, setOpenWithPath, tree]
    );

    const getParent = useCallback(
        (folderId: string) => {
            const path = tree.getPath(folderId) as string[];
            if (path && path.length > 0) {
                path.pop();
                return path.pop();
            }
        },
        [tree]
    );

    function reduceItems(items: any[]): any[] {
        return items.map((i) => ({
            id: i.id,
            children: reduceItems(i.children),
        }));
    }

    const setOrder = useCallback(
        (items: BasicTree[]) => {
            fetch(`${config.api.baseUrl}/tree`, {
                method: "PATCH",
                body: JSON.stringify({ items: reduceItems(items) }),
                headers: getHeaders(),
            })
                .then((res) => {
                    if (res.ok) {
                        menuTree.reload();
                    } else if (res.status === 401) {
                        gotoLogin();
                    } else {
                        messageApi.error("An error occured");
                    }
                })
                .catch((err) => {
                    console.warn(err);
                    messageApi.error("An error occured");
                });

            menuTree.updateOrder(items);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [menuTree, messageApi]
    );

    useEffect(() => {
        const folderId = params?.folderId ?? null;
        if (folderId) {
            setActive(folderId.toString());
        }
    }, [params, activePath, setOpenWithId]);

    useEffect(() => {
        if (active) {
            const path = tree.getPath(active);
            if (path) {
                if (!activePath.length) {
                    setOpenWithPath(path, true);
                }
                setActivePath(path);
            }
        }
        setTransitioningItem(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                setOrder,
                transitioningItem,
                setTransitioningItem,
            }}
        >
            {contextHolder}
            {children}
        </MenuContext.Provider>
    );
}

export function useMenu() {
    return useContext(MenuContext);
}
