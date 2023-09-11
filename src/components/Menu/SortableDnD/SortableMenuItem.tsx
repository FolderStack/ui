import {
    IMenuItem,
    MenuDropdownToggleEvent,
    MenuItemClickEvent,
    useMenu,
} from "@/hooks";
import { Row } from "antd";
import { useParams, useRouter } from "next/navigation";
import {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { SideBarContext } from "../Menu";
import { DragHandle } from "./DragHandle";

export interface MenuItemProps extends IMenuItem {
    onClick(e: MenuItemClickEvent | MenuDropdownToggleEvent): void;
}

export function SortableMenuItem(ctx: any) {
    const sideBarContext = useContext(SideBarContext);
    const menu = useMenu();
    const router = useRouter();
    const params = useParams();
    const labelRef = useRef<HTMLLabelElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    function handleClick(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        const menuEvent = e as MenuItemClickEvent;
        Object.assign(menuEvent, {
            id: ctx.item.id,
            parent: ctx.parent?.id ?? "ROOT",
            type: "click",
        });

        const url = new URL(window.location.href);
        url.searchParams.set("page", "1");
        router.push(`/folder/${ctx.item.id}${url.search}`);
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
                <AiOutlineMinus
                    className="menu--dropdown-icon ai-icon"
                    onClick={handleOpen}
                />
            );
        }
        return (
            <AiOutlinePlus
                className="menu--dropdown-icon ai-icon"
                onClick={handleOpen}
            />
        );
    }, [ctx, handleOpen]);

    const [labelMaxWidth, setLabelMaxWidth] = useState("70%");

    useEffect(() => {
        if (
            labelRef.current &&
            containerRef.current &&
            sideBarContext.siderRef?.current
        ) {
            const labelWidth = labelRef.current.clientWidth;
            const contWidth = containerRef.current.clientWidth;
            const siderWidth = sideBarContext.siderRef.current?.offsetWidth;

            console.log({ labelWidth, contWidth, siderWidth });

            if (ctx.childCount > 0) {
                setLabelMaxWidth("80%");
            } else {
                setLabelMaxWidth("90%");
            }
        }
    }, [labelRef, containerRef, sideBarContext, ctx]);

    const maxWidth = sideBarContext?.siderRef?.current?.offsetWidth ?? 0;

    return (
        <div ref={containerRef} onClick={handleClick} className={mainClass}>
            <Row className={labelClass} style={{ maxWidth }}>
                <DragHandle />
                <label ref={labelRef}>{ctx.item.name}</label>
                <div className="dropdown-icon">
                    {ctx.childCount > 0 && dropdownIcon}
                </div>
            </Row>
        </div>
    );
}
