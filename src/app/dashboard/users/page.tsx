import { createClient } from "@/lib/supabase/server";
import UsersTable from "@/app/dashboard/users/UsersTable";

export default async function Page() {
    const supabase = await createClient();

    const { data: users } = await supabase.from("profiles").select();

    return <UsersTable data={users ?? []} />;
}
