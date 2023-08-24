import { config } from "@/config";
import { gotoLogin } from "@/utils";
import { FetchError } from "node-fetch";
import React, {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { useAccessToken } from "../useAccessToken";

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
    const getToken = useAccessToken();
    const [org, setOrg] = useState<IOrgContext>({
        config: {},
        theme: {},
    });

    const getOrg = useCallback(async () => {
        fetch(`${config.api.baseUrl}/org/me`, {
            headers: {
                Authorization: getToken(),
            },
        })
            .then((res) => {
                if (res.ok) {
                    if (res.status === 401) {
                        gotoLogin();
                        return;
                    }

                    res.json().then((body) => {
                        setOrg(body);
                    });
                }
            })
            .catch((err) => {
                const error = err as FetchError;
                console.log(error.code);
                console.log(error.message);
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
