"use client"

import {Button} from "@/components/ui/button";
import {supabase} from "@/lib/supabase/client";
import {useRouter} from "next/navigation";

export default function LogoutButton(){

    const router = useRouter();

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut({
            scope: "global"
        });

        if (!error)
            router.push("/")
    }


    return (
        <Button
            onClick={handleLogout}
        >Logout
        </Button>
    )


}