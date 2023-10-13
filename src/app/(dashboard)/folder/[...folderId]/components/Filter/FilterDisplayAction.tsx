"use client";
import { Button } from "@/components/Button";
import { useRef, useState } from "react";
import { AiOutlineFilter } from "react-icons/ai";
import { CurrentQueryVals } from "../CurrentQueryVals";

export function FilterDisplayAction({ filterVisible = "0" }) {
    const form = useRef<HTMLFormElement>(null);
    const [currentState, setState] = useState(filterVisible);

    function changeState() {
        if (currentState === "1") {
            setState("0");
        } else {
            setState("1");
        }
        onSubmit();
    }

    function onSubmit() {
        if (form.current) {
            form.current.requestSubmit();
        }
    }

    return (
        <form method="GET" className="flex flex-row">
            <CurrentQueryVals exclude={["filterVisible"]} />
            <input type="hidden" name="filterVisible" value={currentState} />
            <Button
                icon={<AiOutlineFilter />}
                onClick={changeState}
                className="mt-2 px-2.5 rounded border-0 py-2 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary-600 hover:bg-primary-200 transition-all ease-in-out"
            />
        </form>
    );
}
