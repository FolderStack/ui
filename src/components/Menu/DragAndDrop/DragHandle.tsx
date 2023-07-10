import { HolderOutlined } from "@ant-design/icons";
import { useContext } from "react";
import { SortableItemContext } from "./SortableMenuItem";

export function DragHandle() {
    const { attributes, listeners, ref } = useContext(SortableItemContext);

    return (
        <HolderOutlined
            {...attributes}
            {...listeners}
            ref={ref}
            className="menu--item-drag-handle"
        />
    );
}
