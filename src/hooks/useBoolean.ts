import { useCallback, useMemo, useState } from "react";

export function useBoolean(defaultValue = false) {
    const [state, setState] = useState(defaultValue);

    function on() {
        setState(true)
    }

    function off() {
        setState(false)
    }

    const toggle = useCallback(() => {
        setState(!state)
    }, [state]);

    const actions = useMemo(() => ({
        on, off, toggle
    }), [toggle])

    return [state, actions] as const;
}