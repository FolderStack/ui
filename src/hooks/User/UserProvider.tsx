"use client";
import Cookies from "js-cookie";
import React, {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

interface IUser extends Record<string, any> {
    isAdmin: boolean;
}

const UserContext = createContext<IUser | null>(null);

function UserProviderComponent({ children }: PropsWithChildren) {
    const [user, setUser] = useState<IUser | null>(null);

    const getSessionFromCookies = () => {
        const userState = Cookies.get("_fsus");
        if (typeof userState === "string") {
            const state = window.btoa(userState);
            try {
                const userData = JSON.parse(state);
                setUser(userData);
                return;
            } catch (err) {
                //
            }
        }
        // router.push(`/api/auth/login`);
    };

    useEffect(() => {
        getSessionFromCookies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

// function UserProviderComponentWithAuth0({ children }: PropsWithChildren) {
//     return (
//         <Auth0UserProvider>
//             <UserProviderComponent>{children}</UserProviderComponent>
//         </Auth0UserProvider>
//     );
// }

export const UserProvider = React.memo(UserProviderComponent);

export function useUser() {
    return useContext(UserContext);
}
