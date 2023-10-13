import { Irish_Grover } from "next/font/google";
import {
    DetailedHTMLProps,
    FormHTMLAttributes,
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from "react";
import { z } from "zod";

export interface FormContext<T extends Record<string, string | number> = any> {
    submit(): void;
    values: T;
    touched: Record<string, boolean>;
    errors: Record<string, string[] | undefined>;
    onBlur(name: string): void;
    onChange(name: string, value: unknown): void;
    setFieldIgnored(name: string, ignore: boolean): void;
    canSubmit: boolean;
}

const FormContext = createContext<FormContext>({
    submit() {
        // noop
    },
    onBlur() {
        // noop
    },
    onChange() {
        // noop
    },
    setFieldIgnored(name, ignore) {
        // noop
    },
    canSubmit: false,
    touched: {},
    errors: {},
    values: {},
});

export interface FormProps<T extends Record<string, string | number> = any>
    extends DetailedHTMLProps<
        FormHTMLAttributes<HTMLFormElement>,
        HTMLFormElement
    > {
    initialValues: T;
    validationSchema?: z.ZodObject<any> | z.ZodEffects<any, any, any>;
}

export function FormProvider({
    children,
    initialValues,
    validationSchema,
    ...props
}: FormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [originalValues] = useState<Record<string, any>>(initialValues);
    const [values, setValues] = useState<Record<string, any>>(originalValues);
    const [ignored, setIgnored] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string[] | undefined>>(
        {}
    );
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    async function validate(fieldToValidate?: string) {
        try {
            const values = Object.fromEntries(new FormData(formRef.current!));

            if (validationSchema) {
                await validationSchema.parseAsync(values);
            }

            if (fieldToValidate) {
                setErrors({
                    ...errors,
                    [fieldToValidate]: undefined,
                });
            } else {
                setErrors({});
            }
        } catch (err) {
            if (err instanceof z.ZodError) {
                const errorMessages = err.flatten().fieldErrors;
                setErrors(errorMessages);
            }
        }
    }

    function reset() {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    }

    function submit() {
        validate().then(() => {
            formRef.current?.requestSubmit();
            reset();
        });
    }

    function onTouched(name: string) {
        setTouched((touched) => ({ ...touched, [name]: true }));
        validate(name);
    }

    function onBlur(name: string) {
        onTouched(name);
    }

    function onChange(name: string, value: unknown) {
        setValues((values) => ({ ...values, [name]: value }));
        validate(name);
    }

    function setFieldIgnored(name: string, ignore: boolean) {
        if (ignore) {
            setIgnored(ign => Array.from(new Set([...ign, name])));
        } else if(!ignore && ignored.includes(name)) {
            setIgnored(ign => {
                const newArr = [...ign];
                const index = newArr.indexOf(name);
                return newArr.filter((_, i) => i !== index);
            })
        }
    }

    const hasFormChanged = useCallback(() => {
        const hasChanged = Object.keys(originalValues).some(
            (key) => String(originalValues[key]).trim() !== String(values[key]).trim() && !ignored.includes(key)
        );
        return hasChanged;
    }, [originalValues, values, ignored])

    const canSubmit = useMemo(() => {
        const hasNoErrors = Object.entries(errors).every(([name, error]) => !error || ignored.includes(name));
        const hasChanged = hasFormChanged()

        return hasNoErrors && hasChanged;
    }, [errors, hasFormChanged, ignored]);

    return (
        <FormContext.Provider
            value={{
                values,
                submit,
                touched,
                errors,
                onBlur,
                onChange,
                canSubmit,
                setFieldIgnored
            }}
        >
            <form {...props} ref={formRef}>
                {children}
            </form>
        </FormContext.Provider>
    );
}

export function useForm() {
    return useContext(FormContext);
}
