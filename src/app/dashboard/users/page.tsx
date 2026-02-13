import { tableClasses } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export default async function Page() {

    const supabase = await createClient()

    const {data: users} = await supabase.from('profiles').select()

    return (
        <div className="w-full min-w-0 p-4 sm:p-6">
            <div className="flex flex-col gap-4 w-full min-w-0">
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm [-webkit-overflow-scrolling:touch]">
                    <table className={tableClasses}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td data-label="Name">{user.name ?? "—"}</td>
                                    <td data-label="Email">{user.email ?? "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
