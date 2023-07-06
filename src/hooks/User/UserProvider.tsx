"use client";
import {
    UserProvider as Auth0UserProvider,
    useUser as useAuth0User,
} from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import {
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
    const auth0User = useAuth0User();
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

export function UserProvider({ children }: PropsWithChildren) {
    return (
        <Auth0UserProvider>
            <UserProviderComponent>{children}</UserProviderComponent>
        </Auth0UserProvider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
