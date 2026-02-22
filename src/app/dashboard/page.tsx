import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import AdminDashboard from "@/app/dashboard/dashboards/AdminDashboard";

export default async function DashboardPage() {

  const supabase = await createClient();

  const { data: { user: { id }}} = await supabase.auth.getUser();

  if (!id) notFound()

  const { data: { role }, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("auth_id", id)
    .single()


  console.log(role)

  if (role === "admin") {
    return <AdminDashboard/>
  }


  return (
    <div>
      {role}
    </div>
  )

}
