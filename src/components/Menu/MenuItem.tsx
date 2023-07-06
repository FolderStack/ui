import dynamic from "next/dynamic";
import { useCallback, useMemo } from "react";
import { Row } from "../Elements";
import { useMenu } from "./state";
import { IMenuItem, MenuDropdownToggleEvent, MenuItemClickEvent } from "./type";

const UpOutlined = dynamic(() => import("@ant-design/icons/UpOutlined"));
const DownOutlined = dynamic(() => import("@ant-design/icons/DownOutlined"));

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

        return `${base}${dropdownOpen}`;
    }, [isOpen]);

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
            return <UpOutlined onClick={handleOpen} />;
        }
        return <DownOutlined onClick={handleOpen} />;
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
