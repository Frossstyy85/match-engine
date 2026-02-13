import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";

export default function DashboardLayout({children}) {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset className="min-w-0">
                <SidebarTrigger/>
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}

