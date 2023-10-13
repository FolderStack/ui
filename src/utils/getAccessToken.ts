"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getAccessToken() {
    if (process.env.NODE_ENV !== "production") {
        return "Bearer token";
    }

    const cookieStore = cookies();

    const token = cookieStore.get("fsat")?.value;

    if (token) return token;
    redirect("/api/auth/login");
}
