"use server"

import dynamic from "next/dynamic";

const component = {
    admin: dynamic(() => import("@/app/dashboard/components/AdminDashboard"),
        {ssr: true}),
    user: dynamic(() => import("@/app/dashboard/components/UserDashboard"),
        {ssr: true}),
    hr: dynamic(() => import("@/app/dashboard/components/HrDashboard"),
        {ssr: true}),
    project_lead: dynamic(() => import("@/app/dashboard/components/ProjectLeadDashboard"),
        {ssr: true})
};

export default async function DashboardPage() {

    const role = "admin";

    const Dashboard = component[role];

    return <Dashboard/> ?? <div>empty</div>
}
