import { tableClasses } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {

    const supabase = await createClient()

    const {data: users} = await supabase.from('profiles').select()

    return (
        <div className={"w-full h-screen flex justify-center"}>
            <div
                className={"flex flex-col gap-0 max-w-4/5 h-fit mt-5 overflow-auto border-gray-300 border radius rounded w-full"}>
                <div className={"justify-end flex w-full mb-3 p-1 h-full"}>
                </div>
                <table className={tableClasses}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
