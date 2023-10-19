"use client";

<<<<<<< Updated upstream
import { IFile, IFolder } from "@/services/db/models";
=======
import { IFileSystemObject } from "@/services/db/models";
>>>>>>> Stashed changes
import { useEffect, useMemo } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useSelection } from "../../hooks/SelectContext";
import { useDraggingState } from "./DragContext";

export function useDragAndDrop(
<<<<<<< Updated upstream
    item: IFolder | IFile,
=======
    item: IFileSystemObject,
>>>>>>> Stashed changes
    onDrop?: (ids: string[]) => void
) {
    const { dragging, onDragChange, dragId } = useDraggingState();
    const { isSelected: selectedFn, selected } = useSelection();

    const isSelected = useMemo(
        () => selectedFn(String(item.id)),
        [item.id, selectedFn]
    );

    const [{ isOver }, dropRef] = useDrop({
        accept: "ITEM",
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
        drop: ({ id, selected }: any, monitor) => {
            if (monitor.didDrop()) {
                return;
            }

            // Can't drop into something that's being dragged
            if (isSelected) return;

            // Can't drop into itself
            if (id === item.id) return;

            const draggedItems = selected ? Array.from(selected) : [id];
            if (onDrop) onDrop(draggedItems);
        },
    });

    const [{ isDragging }, dragRef, preview] = useDrag({
        type: "ITEM",
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end() {
            if (dragId === item.id) {
                onDragChange(null, false);
            }
        },
        item: {
            id: item.id,
            selected: isSelected ? selected : null,
        },
    });

    useEffect(() => {
        if (!dragId && !dragging) {
            if (isDragging) onDragChange(String(item.id), isDragging);
        }
    }, [isDragging]);

    useEffect(() => {
        const img = new Image();
        img.src =
            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"; // 1x1 pixel transparent image
        img.onload = () => preview(img, { captureDraggingState: true });
    }, [preview]);

    const isThisFolderBeingDragged = useMemo(() => {
        // Another selected item is being dragged, so then this one is too.
        if (
            dragId &&
            dragging &&
            selected.includes(String(item.id)) &&
            selected.includes(dragId) &&
            isSelected
        ) {
            return true;
        }

        // Individually being dragged.
        if (!isSelected && isDragging) {
            return true;
        }

        return false;
    }, [isDragging, isSelected, dragId, dragging, item]);

    return {
        isBeingDragged: isThisFolderBeingDragged,
        isOver,
        dropRef,
        dragRef,
    };
}
