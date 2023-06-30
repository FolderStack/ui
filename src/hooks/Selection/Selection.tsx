import { PropsWithChildren, createContext, useContext, useState } from "react";

const SelectionContext = createContext({
    selected: [] as string[],
    add(id: string) {
        //
    },
    remove(id: string) {
        //
    },
    clear() {
        //
    },
    isSelected(id: string): boolean {
        return false;
    },
    setState(val: string[]) {
        //
    },
});

export function withSelection(Component: React.FC) {
    return function ComponentWithSelection(props: any) {
        return (
            <SelectionProvider>
                <Component {...props} />
            </SelectionProvider>
        );
    };
}

export function SelectionProvider({ children }: PropsWithChildren) {
    const [selected, setSelected] = useState<string[]>([]);

    function add(id: string) {
        const arr = [...selected];
        if (!isSelected(id)) {
            arr.push(id.toLowerCase());
            setState(arr);
        }
    }

    function remove(id: string) {
        const arr = [...selected];
        if (isSelected(id)) {
            const idx = arr.findIndex((i) => i === id.toLowerCase());
            arr.splice(idx, 1);
            setState(arr);
        }
    }

    function isSelected(id: string) {
        return selected.includes(id.toLowerCase());
    }

    function clear() {
        setState([]);
    }

    function setState(val: string[]) {
        setSelected(val);
    }

    return (
        <SelectionContext.Provider
            value={{ selected, add, remove, clear, isSelected, setState }}
        >
            {children}
        </SelectionContext.Provider>
    );
}

export function useSelection() {
    return useContext(SelectionContext);
}
