import "./dashboard.css";

import { getAuthentication } from "@/lib/auth";

export default async function DashboardPage() {
    const auth = await getAuthentication();


    // const roles = auth?.roles ?? [];


    // ADMIN | USER | HR | PROJECT_LEAD
    let roles = []
    roles.push("PROJECT_LEAD");
    
    if (roles.includes("ADMIN")) {
        const { default: AdminDashboard } = await import("./components/AdminDashboard");
        return <AdminDashboard />;
    }

    if (roles.includes("USER")) {
        const { default: UserDashboard } = await import("./components/UserDashboard");
        return <UserDashboard />;
    }

    if (roles.includes("HR")) {
        const { default: HrDashboard } = await import("./components/HrDashboard");
        return <HrDashboard />;
    }

    if (roles.includes("PROJECT_LEAD")) {
        const { default: ProjectLeadDashboard } = await import("./components/ProjectLeadDashboard");
        return <ProjectLeadDashboard />;
    }

    return (
        <div className="dashboard-container">
            <h2>Access Denied</h2>
            <p>You do not have permission to view this page.</p>
        </div>
    );
}
