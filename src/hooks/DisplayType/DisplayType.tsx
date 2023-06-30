import { PropsWithChildren, createContext, useContext, useState } from "react";

type DisplayTypes = "grid" | "list";

const DisplayTypeContext = createContext({
    type: "grid",
    change(type: DisplayTypes) {
        //
    },
});

export function DisplayTypeProvider({ children }: PropsWithChildren) {
    const [type, setType] = useState<DisplayTypes>("grid");

    return (
        <DisplayTypeContext.Provider value={{ type, change: setType }}>
            {children}
        </DisplayTypeContext.Provider>
    );
}

export function useDisplayType() {
    return useContext(DisplayTypeContext);
}
