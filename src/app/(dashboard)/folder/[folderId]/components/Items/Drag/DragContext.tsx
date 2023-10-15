"use client";
import { PropsWithChildren, createContext, useContext, useState } from "react";

const DragContext = createContext({
    dragId: null as string | null,
    dragging: false,
    onDragChange(id: string | null, val: boolean) {
        // noop
    },
});

export function DragProvider({ children }: PropsWithChildren) {
    const [dragId, setDragId] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);

    function onDragChange(id: string | null, val: boolean) {
        setDragId(id);
        setDragging(val);
    }

    return (
        <DragContext.Provider value={{ dragId, dragging, onDragChange }}>
            {children}
        </DragContext.Provider>
    );
}

export function useDraggingState() {
    return useContext(DragContext);
}
