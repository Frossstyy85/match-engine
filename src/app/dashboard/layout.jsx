import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";

export default function DashboardLayout({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="min-w-0">
                <SidebarTrigger />
                <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}

