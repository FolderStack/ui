import { IMenuItem, MenuItemClickEvent, useMenu, useTree } from "@/hooks";
import { BasicTree } from "@/types";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { SortableMenuItem } from "./DragAndDrop/SortableMenuItem";
import { SortableMenuItemList } from "./DragAndDrop/SortableMenuItemList";
import { MenuItem } from "./MenuItem";
import "./menu.css";

export function SideMenu() {
    const menu = useMenu();
    const router = useRouter();
    const { tree } = useTree();

    function onClick(e: MenuItemClickEvent) {
        menu.handleClick(e);
        if (e.type === "click") {
            const id = e.id;
            const query = new URL(window.location.href).searchParams.toString();
            router.push("/folder/" + id + `?${query}`);
        }
    }

    const items = useMemo(() => {
        function recurse(t: BasicTree): any {
            const items = [];
            for (const branch of t.children) {
                items.push(recurse(branch));
            }
            if ("name" in t) {
                return {
                    label: t.name,
                    id: t.id,
                    items,
                };
            } else {
                return items;
            }
        }

        return recurse(tree);
    }, [tree]);

    function onDragChange(items: IMenuItem[]) {
        menu.setOrder("root", items);
    }

    return (
        <div className="menu--root-container">
            <SortableMenuItemList<IMenuItem>
                items={items}
                onChange={onDragChange}
                renderItem={(props) => (
                    <SortableMenuItem id={props.id}>
                        <MenuItem
                            key={props.id}
                            {...{ ...props, onClick }}
                            parent={"root"}
                        />
                    </SortableMenuItem>
                )}
            />
        </div>
    );
}
