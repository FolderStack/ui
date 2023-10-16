"use client";
import { PropsWithChildren, forwardRef, useState } from "react";
import { RxWidth } from "react-icons/rx";
import { Resizable } from "react-resizable";

const INITIAL_WIDTH = 320;
const MAX_WIDTH = 600;

export function SidebarExpander({ children }: PropsWithChildren) {
    const [initialWidth] = useState(INITIAL_WIDTH);
    const [width, setWidth] = useState(initialWidth);

    return (
        <Resizable
            handle={(handle, ref) => <DragHandle ref={ref} width={width} />}
            width={width}
            axis="x"
            onResize={(_, { size }) => setWidth(size.width)}
            minConstraints={[initialWidth, -1]}
            maxConstraints={[MAX_WIDTH, -1]}
        >
            <aside style={{ width }} className={"h-full"}>
                {children}
            </aside>
        </Resizable>
    );
}

const DragHandle = forwardRef(function DragHandleComponent(
    props: any,
    ref: any
) {
    const dragProps: any = {
        ...props,
    };

    delete dragProps.handleAxis;

    let width = props.width;
    width = Math.max(INITIAL_WIDTH, width);
    width = Math.min(MAX_WIDTH, width);

    const halfDragWidthOffset = (8 * 0.25 * 16) / 2;

    return (
        <span
            {...dragProps}
            ref={ref}
            className="h-8 w-8 bg-gray-200 border-2 shadow-lg rounded-full absolute bottom-6 z-40 flex items-center justify-center cursor-pointer hover:bg-gray-100 active:bg-gray-100 transition-background ease-in-out"
            style={{ left: width - halfDragWidthOffset + "px" }}
        >
            <RxWidth />
        </span>
    );
});
