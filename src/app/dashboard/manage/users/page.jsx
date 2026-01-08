import {getUsers} from "@/db/repositories/UserRepository";
import {navigate} from "next/dist/client/components/segment-cache/navigation";

export default async function UserPage(){

    const users = await getUsers();


    return (
        <div>
            {users.map((user, index) => (
                <pre key={index}>
                {JSON.stringify(user, null, 2)}
                </pre>
            ))}
        </div>
    )
}