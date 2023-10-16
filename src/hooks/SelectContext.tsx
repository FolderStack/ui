"use client";
import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

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

interface SelectionProviderProps extends PropsWithChildren {
    items?: any[];
}

export function SelectionProvider({
    children,
    items = [],
}: SelectionProviderProps) {
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

    // If items change, remove excess selections to ensure
    // button states are reflected properly etc.
    useEffect(() => {
        const newState = [];
        for (const id in selected) {
            if (items.find((v) => v.id === id)) {
                newState.push(id);
            }
        }
        setState(newState);
    }, [items]);

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
