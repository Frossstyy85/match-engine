import "./dashboard.css";

export default async function DashboardPage() {

    let role = "ADMIN";
    
    if (role === "ADMIN") {
        const { default: AdminDashboard } = await import("./components/AdminDashboard");
        return <AdminDashboard />;
    }

    if (role === "USER") {
        const { default: UserDashboard } = await import("./components/UserDashboard");
        return <UserDashboard />;
    }

    if (role === "HR") {
        const { default: HrDashboard } = await import("./components/HrDashboard");
        return <HrDashboard />;
    }

    if (role === "PROJECT_LEAD") {
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
