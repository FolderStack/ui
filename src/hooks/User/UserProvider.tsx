import { PropsWithChildren, createContext, useContext, useState } from "react";

const UserContext = createContext({
    isAdmin: false
});

export function UserProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState({ isAdmin: true });

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    return useContext(UserContext);
}