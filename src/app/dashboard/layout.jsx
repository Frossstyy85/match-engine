import Sidebar from "@/components/sidebar/Sidebar";

export default function DashboardLayout({children}) {
    return (
        <div className="min-h-screen">
            <Sidebar/>
            <main className="min-h-screen ml-[300px]">{children}</main>
        </div>
    );
}

