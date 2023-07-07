import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Row } from "antd";
import { useCallback, useMemo } from "react";
import { useMenu } from "./state";
import { IMenuItem, MenuDropdownToggleEvent, MenuItemClickEvent } from "./type";

export interface MenuItemProps extends IMenuItem {
    onClick(e: MenuItemClickEvent | MenuDropdownToggleEvent): void;
}

export function MenuItem({
    id,
    label,
    items = [],
    onClick,
    parent,
}: MenuItemProps) {
    const menuState = useMenu();

    function handleClick(e: React.MouseEvent) {
        e.stopPropagation();
        const menuEvent = e as MenuItemClickEvent;
        Object.assign(menuEvent, { id, parent, type: "click" });
        onClick(menuEvent);
    }

    const handleOpen = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            const openEvent = e as MenuDropdownToggleEvent;
            Object.assign(openEvent, { id, parent, type: "open-toggle" });
            onClick(openEvent);
        },
        [id, parent, onClick]
    );

    const isActive = useMemo(() => {
        return menuState.active === id;
    }, [menuState, id]);

    const hasChildren = useMemo(() => {
        return !!items?.length;
    }, [items]);

    const isOpen = useMemo(() => {
        const pIdx = menuState.open.findIndex(([p]) => p === parent);
        if (pIdx !== -1) {
            const parentItems = menuState.open[pIdx][1];
            return parentItems.includes(id);
        }
        return false;
    }, [menuState.open, id, parent]);

    const mainClass = useMemo(() => {
        const base = "menu--item";
        const dropdownOpen = isOpen ? " open" : "";
        const active = isActive ? " active" : "";
        const childActive = menuState.activePath.includes(id)
            ? " active-child"
            : "";

        return `${base}${dropdownOpen}${active}${childActive}`;
    }, [isOpen, isActive, menuState, id]);

    const labelClass = useMemo(() => {
        const base = "menu--label";
        const hasDropdown = items?.length ? " dropdown" : "";

        return `${base}${hasDropdown}`;
    }, [items]);

    const dropdownClass = useMemo(() => {
        const base = "menu--dropdown";
        const dropdownOpen = isOpen ? " open" : "";

        return `${base}${dropdownOpen}`;
    }, [isOpen]);

    const dropdownIcon = useMemo(() => {
        if (isOpen) {
            return <MinusOutlined onClick={handleOpen} />;
        }
        return <PlusOutlined onClick={handleOpen} />;
    }, [isOpen, handleOpen]);

    return (
        <div onClick={handleClick} className={mainClass}>
            <Row className={labelClass}>
                <span>{label}</span>
                <div className="dropdown-icon">
                    {hasChildren && dropdownIcon}
                </div>
            </Row>
            {hasChildren && (
                <div
                    className={dropdownClass}
                    onClick={(e) => e.stopPropagation()}
                >
                    {items.map((child, idx) => (
                        <MenuItem
                            key={child.id ?? idx}
                            {...child}
                            parent={id}
                            onClick={onClick}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
