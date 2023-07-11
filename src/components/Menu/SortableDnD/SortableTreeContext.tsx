import { SimpleTreeItemWrapper } from "dnd-kit-sortable-tree";
import { TreeItem } from "dnd-kit-sortable-tree/dist/types";
import {
    PropsWithChildren,
    createContext,
    forwardRef,
    useContext,
} from "react";
import { SortableMenuItem } from "./SortableMenuItem";
import "./sortable-menu.css";

type Context<T = any> = TreeItem<T>;

const SortableTreeContext = createContext<Context>({} as any);
type Props = PropsWithChildren & Context;

export const SortableTreeItem = forwardRef(function SortableTreeItem(
    props: Props,
    ref: any
) {
    if (!props.item?.isVisible) return null;

    return (
        <SimpleTreeItemWrapper
            className="sidebar-menu"
            {...(props as any)}
            ref={ref}
            showDragHandle={false}
            disableCollapseOnItemClick
        >
            <SortableTreeContext.Provider value={props}>
                <SortableMenuItem {...props} />
            </SortableTreeContext.Provider>
        </SimpleTreeItemWrapper>
    );
});

export function useSortableMenuItem() {
    return useContext(SortableTreeContext);
}
