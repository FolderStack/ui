import { useState } from "react";
import DP from "tailwind-datepicker-react";
import { IDatePickerProps } from "tailwind-datepicker-react/types/Components/DatePicker";

interface DatePickerProps extends Omit<IDatePickerProps, "show" | "setShow"> {
    initialValue?: Date;
    onChange?: (date: Date) => void;
    name: string;
}

export function DatePicker({
    initialValue,
    onChange,
    name,
    ...props
}: DatePickerProps) {
    const [show, setShow] = useState(false);

    return (
        <DP
            {...props}
            {...{ show, setShow }}
            onChange={onChange}
            options={
                {
                    ...(props.options ?? {}),
                    defaultDate: initialValue || props.options?.defaultDate,
                    inputNameProp: name,
                    theme: {
                        // background: "bg-white",
                        todayBtn:
                            "w-full px-5 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded dark:text-white dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 focus:ring-4 focus:ring-primary-300",
                        clearBtn:
                            "w-full px-5 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded dark:text-white dark:bg-gray-700 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 focus:ring-4 focus:ring-primary-300",
                        icons: "bg-white dark:bg-gray-700 rounded text-gray-500 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-white text-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-gray-200",
                        // text: "",
                        // disabledText: "",
                        input: "pl-2.5 pr-2.5 py-2.5 bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-primary-500 focus:border-primary-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500",
                        inputIcon: "hidden",
                        ...(props.options?.theme ?? {}),
                    },
                } as any
            }
        />
    );
}
