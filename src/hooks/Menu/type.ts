export interface IMenuItem {
    id: string;
    label: string;
    items: IMenuItem[];
    parent: string;
}

export interface MenuItemClickEvent extends React.MouseEvent {
    id: string;
    parent: string;
    type: "click";
}

export interface MenuDropdownToggleEvent extends React.MouseEvent {
    id: string;
    parent: string;
    type: "open-toggle";
}

export type OpenState = [string, string[]][];

export interface IdTree {
    id: string;
    children: IdTree[];
}

export interface IMenuContext {
    active: string | null;
    activePath: string[];
    open: OpenState;
    setOpen(val: OpenState): void;
    handleClick(e: MenuItemClickEvent | MenuDropdownToggleEvent): void;
    getParent(folderId: string): string | undefined;
    setOrder(items: IdTree[]): void;
}
