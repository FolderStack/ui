import { useTree } from "@/hooks";
import { Tree } from "@/types";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import "./menu.css";
import { MenuProvider } from "./state";
import { MenuItemClickEvent } from "./type";

export function SideMenu() {
    const router = useRouter();
    const { tree } = useTree();

    function onClick(e: MenuItemClickEvent) {
        const id = e.id;
        router.push("/folder/" + id);
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

    return <MenuProvider {...{ items, onClick }} />;
}
