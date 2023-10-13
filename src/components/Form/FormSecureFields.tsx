interface FormSecureFieldsProps {
    csrf: string;
    nonce: string;
}

export function FormSecureFields({ csrf, nonce }: FormSecureFieldsProps) {
    return (
        <>
            <input type="hidden" name="$CSRF" value={csrf} />
            <input type="hidden" name="$NONCE" value={nonce} />
        </>
    )
}