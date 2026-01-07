import {getUsers} from "@/db/repositories/UserRepository";

export default async function UserPage(){

    const users = await getUsers();

    return (
        <div>
            {users.map((user, idx) => (
                <p key={idx}>{user.password_hash}</p>
            ))}
        </div>
    )
}