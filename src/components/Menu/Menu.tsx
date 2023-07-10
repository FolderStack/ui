import { MenuItemClickEvent, useMenu, useTree } from "@/hooks";
import { Tree } from "@/types";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
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
        function recurse(t: Tree): any {
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

    return (
        <div className="menu--root-container">
            {items?.map?.((child: any, idx: number) => (
                <MenuItem
                    key={child.id ?? idx}
                    {...{ ...child, onClick }}
                    parent={"root"}
                />
            ))}
        </div>
    );
}
