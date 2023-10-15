"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Signin() {
    const router = useRouter();
    const { status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            void signIn("credentials");
        } else if (status === "authenticated") {
            void router.push("/");
        }
    }, [status]);

    return <div></div>;
}
