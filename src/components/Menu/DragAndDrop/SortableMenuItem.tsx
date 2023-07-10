import type {
    DraggableSyntheticListeners,
    UniqueIdentifier,
} from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CSSProperties, PropsWithChildren } from "react";
import { createContext, useMemo } from "react";

interface Props {
    id: UniqueIdentifier;
}

interface Context {
    attributes: Record<string, any>;
    listeners: DraggableSyntheticListeners;
    ref(node: HTMLElement | null): void;
}

export const SortableItemContext = createContext<Context>({
    attributes: {},
    listeners: undefined,
    ref() {},
});

export function SortableMenuItem({ children, id }: PropsWithChildren<Props>) {
    const {
        attributes,
        isDragging,
        listeners,
        setNodeRef,
        setActivatorNodeRef,
        transform,
        transition,
    } = useSortable({ id });
    const context = useMemo(
        () => ({
            attributes,
            listeners,
            ref: setActivatorNodeRef,
        }),
        [attributes, listeners, setActivatorNodeRef]
    );
    const style: CSSProperties = {
        opacity: isDragging ? 0.4 : undefined,
        transform: CSS.Translate.toString(transform),
        transition,
    };

    return (
        <SortableItemContext.Provider value={context}>
            <div ref={setNodeRef} style={style}>
                {children}
            </div>
        </SortableItemContext.Provider>
    );
}
