"use client"
import {useUserStore} from "@/lib/store";
import {User} from "@/lib/types";

export default function Navbar() {

    const user = useUserStore(state => state.user)

    return (
        <div>
            { user? <h1>Logged in</h1> : <h1>Logged out</h1>}
        </div>
    );
}
