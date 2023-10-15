"use client";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineFilter } from "react-icons/ai";

export function FilterDisplayAction({ filterVisible = "0" }) {
    const router = useRouter();
    const [currentState, setState] = useState(filterVisible);

    function onChange() {
        const newState = currentState === "1" ? "0" : "1";
        const url = new URL(window.location.href);

        setState(newState);

        url.searchParams.set("filterVisible", newState);
        router.replace(url.pathname + url.search);
    }

    return (
        <div className="flex flex-row">
            <input type="hidden" name="filterVisible" value={currentState} />
            <Button
                icon={<AiOutlineFilter />}
                onClick={onChange}
                className="mt-2 px-2.5 rounded border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 hover:bg-primary-400 hover:text-white hover:ring-primary-400 transition-all ease-in-out"
            />
        </div>
    );
}
