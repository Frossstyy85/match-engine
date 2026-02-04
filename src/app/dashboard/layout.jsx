import Sidebar from "@/components/sidebar/Sidebar";
import "./layout.css";
import QueryProvider from "@/app/dashboard/QueryProvider";
import {AuthProvider} from "@/app/dashboard/AuthProvider";

export default function DashboardLayout({children}) {

    return (
        <QueryProvider>
            <AuthProvider>
                <div className="dashboard-layout">
                    <Sidebar/>
                    <main className={"main-content"}>{children}</main>
                </div>
            </AuthProvider>
        </QueryProvider>
    );
}

