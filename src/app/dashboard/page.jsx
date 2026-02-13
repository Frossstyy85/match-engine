"use server"

import dynamic from "next/dynamic";

const component = {
    admin: dynamic(() => import("@/app/dashboard/dashboards/AdminDashboard"),
        {ssr: true}),
    user: dynamic(() => import("@/app/dashboard/dashboards/UserDashboard"),
        {ssr: true}),
    hr: dynamic(() => import("@/app/dashboard/dashboards/HrDashboard"),
        {ssr: true}),
    project_lead: dynamic(() => import("@/app/dashboard/dashboards/ProjectLeadDashboard"),
        {ssr: true})
};

export default async function DashboardPage() {

    const role = "admin";

    const Dashboard = component[role];


    return (
        <div>
            <Dashboard/>
        </div>

    )
}
