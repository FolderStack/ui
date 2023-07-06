"use client";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment, useEffect, useState } from "react";

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}

interface SelectItem {
    value: string;
    label: string;
}

interface SelectProps {
    label?: string;
    placeholder?: string;
    options: SelectItem[];
    value?: SelectItem["value"];
    onChange?: (val: string) => void;
}

export function Select(props: SelectProps) {
    const [selected, setSelected] = useState<SelectItem | null>(null);

    function handleChange(item: SelectItem) {
        props?.onChange?.(item.value);
        setSelected(item);
    }

    useEffect(() => {
        if (props.value && props.value !== selected?.value) {
            const item = props.options.find((i) => i.value === props.value);
            if (item) {
                setSelected(item);
            }
        }
    }, [props.value, props.options, selected]);

    return (
        <Listbox value={selected} onChange={handleChange}>
            {({ open }) => (
                <>
                    {props.label && (
                        <Listbox.Label className="block text-sm font-medium leading-6 text-gray-900">
                            {props?.label}
                        </Listbox.Label>
                    )}
                    <div className="relative mt-2">
                        <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                            <span className="block truncate">
                                {selected?.label ?? props.placeholder}
                            </span>
                            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                />
                            </span>
                        </Listbox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {props.options.map((item) => (
                                    <Listbox.Option
                                        key={item.value}
                                        className={({ active }) =>
                                            classNames(
                                                active
                                                    ? "bg-indigo-600 text-white"
                                                    : "text-gray-900",
                                                "relative cursor-default select-none py-2 pl-3 pr-9"
                                            )
                                        }
                                        value={item}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={classNames(
                                                        selected
                                                            ? "font-semibold"
                                                            : "font-normal",
                                                        "block truncate"
                                                    )}
                                                >
                                                    {item.label}
                                                </span>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active
                                                                ? "text-white"
                                                                : "text-indigo-600",
                                                            "absolute inset-y-0 right-0 flex items-center pr-4"
                                                        )}
                                                    >
                                                        <CheckIcon
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Listbox>
    );
}
