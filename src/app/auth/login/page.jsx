"use client"

import "./auth.css"

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import {useRouter} from "next/navigation";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            setError(error.message);
            return;
        }

        router.push("/dashboard")
    };

    return (
        <div className={"form-area"}>
        <form onSubmit={handleLogin}>
            <div className={"input-area"}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit">Sign In</button>
            </div>
        </form>
        </div>
    );
}