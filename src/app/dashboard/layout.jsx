import Sidebar from "@/components/sidebar/Sidebar";
import "./layout.css";


export default async function DashboardLayout({children}) {

    return (
        <div className="dashboard-layout">
            <Sidebar/>
            <main className={"main-content"}>{children}</main>
        </div>
    );
}

