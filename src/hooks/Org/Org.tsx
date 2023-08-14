import { gotoLogin } from "@/utils";
import React, {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

interface IOrgContext {
    org?: {
        id: string;
        name: string;
    };
    config: any;
    theme: any;
}

const OrgContext = createContext<IOrgContext>({
    config: {},
    theme: {},
});

export function OrgProviderComponent({ children }: PropsWithChildren) {
    const [org, setOrg] = useState<IOrgContext>({
        config: {},
        theme: {},
    });

    const getOrg = useCallback(async () => {
        fetch(`/api/org/me`).then((res) => {
            if (res.ok) {
                if (res.status === 401) {
                    gotoLogin();
                    return;
                }

                res.json().then((body) => {
                    setOrg(body);
                });
            }
        });
    }, []);

    useEffect(() => {
        getOrg();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <OrgContext.Provider value={org}>{children}</OrgContext.Provider>;
}

export const OrgProvider = React.memo(OrgProviderComponent);

export function useOrg() {
    return useContext(OrgContext);
}
