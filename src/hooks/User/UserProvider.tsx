"use client";
import { useRouter } from "next/navigation";
import React, {
    PropsWithChildren,
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";

interface IUser extends Record<string, any> {
    isAdmin: boolean;
}

const UserContext = createContext<IUser | null>(null);

function UserProviderComponent({ children }: PropsWithChildren) {
    const auth0User = useMemo(() => ({ isLoading: false, user: {} }), []); //useAuth0User();
    const [user, setUser] = useState<IUser | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!auth0User.isLoading && !auth0User.user) {
            router.push(`/api/auth/login`);
        } else if (auth0User.user) {
            setUser({ ...auth0User.user, isAdmin: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [auth0User, router]);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

function UserProviderComponentWithAuth0({ children }: PropsWithChildren) {
    return (
        // <Auth0UserProvider>
        <UserProviderComponent>{children}</UserProviderComponent>
        // </Auth0UserProvider>
    );
}

export const UserProvider = React.memo(UserProviderComponentWithAuth0);

export function useUser() {
    return useContext(UserContext);
}
