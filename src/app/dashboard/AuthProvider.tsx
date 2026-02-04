"use client"


import {User} from "@supabase/auth-js";
import React, {useContext, useEffect, useMemo, useState} from "react";
import {supabase} from "@/lib/supabase/client";

type AuthContextValue = {
    user: User
}

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({children}) {

    const [user, setUser] = useState<User>(null)

    useEffect(() => {
        let mounted = true;

        async function init() {
            const {data: {user: u}, error} = await supabase.auth.getUser();
            if (!mounted) return

            setUser(u ?? null)
        }

        init()


        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
            if (!mounted) return;
            setUser(session.user ?? null)
        })


        return () => {
            mounted = false;
            subscription.unsubscribe()
        }


    }, []);

    const value: AuthContextValue = useMemo(
        () => ({
            user
        }),
        [user]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>

}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("No provider found")
    return ctx;
}
