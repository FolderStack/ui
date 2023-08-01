import { useEffect, useRef } from "react";

export function usePrevious<T>(value: T): T | null {
    // Create a reference to hold the previous version of the value,
    // as it is basically a generic object whose `current` property can hold any value.
    const ref = useRef<T | null>(null);

    // Use the `useEffect` hook to run a callback...
    useEffect(() => {
        // ...to store the passed value on the ref's current property...
        ref.current = value;
    }, [value]); // ...whenever the value changes.

    // And return the currently stored value,
    // as this will run before the `useEffect` callback runs.
    return ref.current;
}
