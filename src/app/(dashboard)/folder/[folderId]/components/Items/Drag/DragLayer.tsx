import React, { useMemo, useRef } from "react";
import { XYCoord, useDragLayer } from "react-dnd";

const layerStyles: React.CSSProperties = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 100,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
};

function getItemStyles(
    initialOffset: XYCoord | null,
    currentOffset: XYCoord | null,
    clientOffset: XYCoord | null,
    eleRect?: DOMRect
): React.CSSProperties {
    if (!initialOffset || !currentOffset || !clientOffset) {
        return {
            display: "none",
        };
    }

    let { width = 0, height = 0 } = eleRect ?? {};
    let { x: cx, y: cy } = clientOffset;
    const transform = `translate(${cx - width / 2}px, ${
        cy - (height * 2) / 3
    }px)`;

    return {
        transform,
        WebkitTransform: transform,
    };
}

interface DragItem {
    index: number;
    id: string;
    type: string;
    selected: string[] | null;
    getRef(): HTMLElement | null;
}

export function DragLayer({ items = [] as any[] }) {
    const {
        itemType,
        isDragging,
        item,
        initialOffset,
        currentOffset,
        clientOffset,
    } = useDragLayer((monitor) => ({
        item: monitor.getItem() as DragItem,
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        clientOffset: monitor.getClientOffset(),
        isDragging: monitor.isDragging(),
    }));

    const previewRef = useRef<HTMLDivElement>(null);

    const rect = previewRef.current?.getBoundingClientRect();
    const currentItem = useMemo(() => {
        return items.find((v) => v?.id === item?.id);
    }, [items, item]);

    if (!isDragging) return null;

    return (
        <div style={layerStyles}>
            <div
                style={getItemStyles(
                    initialOffset,
                    currentOffset,
                    clientOffset,
                    rect
                )}
            >
                <div
                    className="absolute bg-primary-400 rounded-sm w-52 truncate text-sm text-white flex items-center justify-start p-2 z-20 shadow-lg"
                    ref={previewRef}
                >
                    <span>{currentItem.name}</span>
                </div>
                {item.selected?.length && item.selected.length > 1 && (
                    <div
                        className="bg-gray-400 rounded-sm w-52 truncate text-sm text-white flex items-center justify-center p-2 z-10 absolute top-1 left-1 shadow-lg"
                        ref={previewRef}
                    >
                        &nbsp;
                    </div>
                )}
                <div
                    className={`absolute z-30 rounded-full bg-red-600 font-medium text-white text-sm p-1 h-6 w-6 flex items-center justify-center -top-2 shadow-lg`}
                    style={{
                        left: (rect?.width ?? 0) - (6 * 0.25 * 16) / 2 + "px",
                    }}
                >
                    {item.selected?.length ?? 1}
                </div>
            </div>
        </div>
    );
}
