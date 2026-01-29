import "./dashboard.css";
import AdminDashboard from "@/app/dashboard/components/AdminDashboard";
import ProjectLeadDashboard from "@/app/dashboard/components/ProjectLeadDashboard";
import HrDashboard from "@/app/dashboard/components/HrDashboard";
import UserDashboard from "@/app/dashboard/components/UserDashboard";


export default function DashboardPage() {

    const role = "ADMIN"

    return (
        <>
            {role === "ADMIN" && <AdminDashboard/>}
            {role === "USER" && <UserDashboard/>}
            {role === "HR" && <HrDashboard/>}
            {role === "PROJECT_LEAD" && <ProjectLeadDashboard/>}
        </>
    )


}
