import {
    IMenuItem,
    MenuDropdownToggleEvent,
    MenuItemClickEvent,
    useMenu,
} from "@/hooks";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { Row } from "antd";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { DragHandle } from "./DragHandle";

export interface MenuItemProps extends IMenuItem {
    onClick(e: MenuItemClickEvent | MenuDropdownToggleEvent): void;
}

export function SortableMenuItem(ctx: any) {
    const menu = useMenu();
    const router = useRouter();
    const params = useParams();

    function handleClick(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        const menuEvent = e as MenuItemClickEvent;
        Object.assign(menuEvent, {
            id: ctx.item.id,
            parent: ctx.parent?.id ?? "ROOT",
            type: "click",
        });

        const q = new URL(window.location.href).search;
        router.push(`/folder/${ctx.item.id}${q}`);

        menu.handleClick(menuEvent);
    }

    const handleOpen = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            const openEvent = e as MenuDropdownToggleEvent;
            Object.assign(openEvent, {
                id: ctx.item.id,
                parent: ctx.parent?.id ?? "ROOT",
                type: "open-toggle",
            });
            menu.handleClick(openEvent);
        },
        [menu, ctx]
    );

    const isActive = useMemo(() => {
        return params?.folderId === ctx.item.id;
    }, [params, ctx]);

    const mainClass = useMemo(() => {
        const base = "menu--item";
        const dropdownOpen = ctx.item?.isOpen ? " open" : "";
        const active = isActive ? " active" : "";
        const childActive = menu.activePath.includes(ctx.item.id)
            ? " active-child"
            : "";

        return `${base}${dropdownOpen}${active}${childActive}`;
    }, [isActive, ctx, menu]);

    const labelClass = useMemo(() => {
        const base = "menu--label";
        const hasDropdown = ctx.childCount > 0 ? " dropdown" : "";

        return `${base}${hasDropdown}`;
    }, [ctx]);

    const dropdownIcon = useMemo(() => {
        if (ctx.item?.isOpen) {
            return (
                <MinusOutlined
                    className="menu--dropdown-icon"
                    onClick={handleOpen}
                />
            );
        }
        return (
            <PlusOutlined
                className="menu--dropdown-icon"
                onClick={handleOpen}
            />
        );
    }, [ctx, handleOpen]);

    return (
        <div onClick={handleClick} className={mainClass}>
            <Row className={labelClass}>
                <DragHandle />
                <label>{ctx.item.name}</label>
                <div className="dropdown-icon">
                    {ctx.childCount > 0 && dropdownIcon}
                </div>
            </Row>
        </div>
    );
}
