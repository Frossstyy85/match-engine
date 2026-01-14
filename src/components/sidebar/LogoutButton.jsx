"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton(){

    const router = useRouter();

    const handleLogout = async () => {
        try {

            const res = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include"
            })
            if (!res.ok) {
                throw new Error("Failed to logout")
            }

            router.push("/");
        } catch (err) {
            console.log(err);
        } finally {

        }
    }

    return (
        <>
            <button onClick={handleLogout}>Logout</button>
        </>
    )
}