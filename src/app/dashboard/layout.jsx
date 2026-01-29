import Sidebar from "@/components/sidebar/Sidebar";
import "./layout.css";
import QueryProvider from "@/app/dashboard/QueryProvider";

export default function DashboardLayout({children}) {

    return (
        <QueryProvider>
            <div className="dashboard-layout">
                <Sidebar/>
                <main className={"main-content"}>{children}</main>
            </div>
        </QueryProvider>
    );
}

