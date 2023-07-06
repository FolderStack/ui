import { InputProps } from "./types";

interface CheckboxProps extends InputProps {
    checked?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    disabled?: boolean;
}

export function Checkbox(props: CheckboxProps) {
    return <input type="checkbox" />;
}
