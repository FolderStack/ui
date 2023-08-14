import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export function useCsrfToken() {
    const [csrf, setCsrf] = useState<string | null>(null);

    const update = () => {
        const value = Cookies.get("fscsrf");
        if (value && String(value) !== csrf) {
            setCsrf(String(value));
        }
    };

    useEffect(() => {
        update();

        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return csrf ?? "";
}
