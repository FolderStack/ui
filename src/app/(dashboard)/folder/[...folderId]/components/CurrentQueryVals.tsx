"use client";
import { useSearchParams } from "next/navigation";

export function CurrentQueryVals({ exclude }: { exclude: string[] }) {
    const params = useSearchParams();

    return (
        <>
            {Array.from(params.entries()).map(([key, val]) => {
                if (exclude.includes(key)) return null;
                return <input type="hidden" name={key} value={val} key={key} />;
            })}
        </>
    );
}
