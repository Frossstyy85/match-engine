"use server"

import "./dashboard.css";
import dynamic from "next/dynamic";

const component = {
    admin: dynamic(() => import("@/app/dashboard/components/AdminDashboard")),
    user: dynamic(() => import("@/app/dashboard/components/UserDashboard")),
    hr: dynamic(() => import("@/app/dashboard/components/HrDashboard")),
    project_lead: dynamic(() => import("@/app/dashboard/components/ProjectLeadDashboard"))
}


export default async function DashboardPage() {

    const role = "admin"

    const Dashboard = component[role];

    return (
        <Dashboard/>
    )


}
