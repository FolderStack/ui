import { IFile, IFolder } from "@/services/db/models";
import { useEffect, useMemo, useState } from "react";
import { useSelection } from "../../../../../../hooks/SelectContext";

export function useSelectOnControlClick(item: IFile | IFolder) {
    const { isSelected: selectedFn, add, remove } = useSelection();

    const isSelected = useMemo(
        () => selectedFn(String(item.id)),
        [item.id, selectedFn]
    );

    const [ctrlActive, setCtrlActive] = useState(false);

    const onDown = (e: KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && !ctrlActive) {
            setCtrlActive(true);
        }
    };

    const onUp = () => {
        setCtrlActive(false);
    };

    useEffect(() => {
        window.addEventListener("keydown", onDown);
        window.addEventListener("keyup", onUp);

        return () => {
            removeEventListener("keydown", onDown);
            removeEventListener("keyup", onUp);
        };
    }, []);

    const onClick = (e: MouseEvent) => {
        if (ctrlActive) {
            e.preventDefault();
            e.stopPropagation();
            isSelected ? remove(String(item.id)) : add(String(item.id));
            return true;
        }
        return false;
    };

    return { onClick, isSelected };
}
