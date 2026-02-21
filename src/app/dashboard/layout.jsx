import QueryProvider from '@/app/dashboard/query-provider'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

export default function DashboardLayout({ children }) {
  return (
    <QueryProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset className='min-w-0'>
          <SidebarTrigger />
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </QueryProvider>
  )
}
