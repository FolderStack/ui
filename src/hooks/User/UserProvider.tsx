"use client";
import { config } from "@/config";
import Cookies from "js-cookie";
import {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import { usePageLoading } from "../PageLoading";

interface IUser extends Record<string, any> {
    isAdmin: boolean;
}

const UserContext = createContext<IUser | null>(null);

export function UserProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<IUser | null>(null);
    const { loading } = usePageLoading();

    const getSessionFromCookies = () => {
        if (config.env === "dev") {
            setUser({ isAdmin: true });
            loading.off();
            return;
        }

        const userState = Cookies.get("fsus");
        if (typeof userState === "string") {
            const state = Buffer.from(userState, "base64").toString("ascii");
            try {
                const userData = JSON.parse(state);
                const isAdmin = !!userData?.r?.includes?.("1");
                setUser({ ...userData, isAdmin });
                loading.off();
                return;
            } catch (err) {
                console.warn(err);
            }
        }
    };

    useEffect(() => {
        getSessionFromCookies();
        const intervalId = setInterval(getSessionFromCookies, 3500); // Check every 3.5 seconds

        // Cleanup: clear the interval when the component is unmounted
        return () => {
            clearInterval(intervalId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
    return useContext(UserContext);
}
