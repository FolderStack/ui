import { Tree } from "@/utils";
import { useParams } from "next/navigation";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { MenuItem } from "./MenuItem";
import {
    IMenuContext,
    IMenuItem,
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
});

interface MenuProps {
    items: IMenuItem[];
    initial?: OpenState;
    onClick(e: MenuItemClickEvent): void;
}

export function MenuProvider({ items = [], onClick, initial = [] }: MenuProps) {
    const [open, setOpen] = useState<OpenState>(initial);
    const [active, setActive] = useState<string | null>(null);
    const [activePath, setActivePath] = useState<string[]>([]);
    const params = useParams();

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
        } else {
            onClick(e);
        }
    }

    const buildTree = useCallback(
        (tree: Tree, arr = items) => {
            for (const item of arr) {
                const itemTree = new Tree(tree);
                itemTree.addLeaf(item.id);
                tree.addNode(itemTree);
                buildTree(itemTree, item.items ?? []);
            }
        },
        [items]
    );

    const tree = useMemo(() => {
        const root = new Tree();
        buildTree(root);
        return root;
    }, [buildTree]);

    useEffect(() => {
        const folderId = params?.folderId ?? null;
        if (folderId) {
            setActive(folderId);
        }
    }, [params]);

    useEffect(() => {
        const path = tree.getPath(active);

        if (path) {
            let _open: any = [];
            for (let i = 0; i < path.length; i++) {
                _open.push([path[i - 1] ?? "root", [path[i]]]);
            }
            if (!open.length) {
                setOpen(_open);
            }
        }
    }, [items, active, tree]);

    useEffect(() => {
        if (active) {
            const path = tree.getPath(active);
            if (path) setActivePath(path);
        }
    }, [active, tree]);

    console.log(open);

    return (
        <MenuContext.Provider value={{ open, setOpen, active, activePath }}>
            <div className="menu--root-container">
                {items?.map?.((child, idx) => (
                    <MenuItem
                        key={child.id ?? idx}
                        {...{ ...child, onClick }}
                        parent={"root"}
                        onClick={handleClick}
                    />
                ))}
            </div>
        </MenuContext.Provider>
    );
}

export function useMenu() {
    return useContext(MenuContext);
}
