import { createContext, useContext, useState } from "react";
import { MenuItem } from "./MenuItem";
import {
    IMenuContext,
    IMenuItem,
    MenuDropdownToggleEvent,
    MenuItemClickEvent,
    OpenState,
} from "./type";

const MenuContext = createContext<IMenuContext>({
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

    return (
        <MenuContext.Provider value={{ open, setOpen }}>
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
