"use client";
import { isLocal } from "@/config/dev";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Signin() {
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            void signIn(isLocal ? "credentials" : "oauth");
        } else if (status === "authenticated") {
            void router.push("/");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    return <div>Signing in...</div>;
}
