'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { logout } from '@/lib/auth/logout'

const navigationItems = [
  { title: 'Dashboard', url: '/dashboard' },
  { title: 'Projects', url: '/dashboard/projects' },
  { title: 'Teams', url: '/dashboard/teams' },
  { title: 'Skills', url: '/dashboard/skills' },
  { title: 'Users', url: '/dashboard/users' }
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>Match engine</SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigationItems.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url || (item.url !== '/dashboard' && pathname.startsWith(item.url))}
                >
                  <Link href={item.url}>{item.title}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Button onClick={logout}>Logout</Button>
      </SidebarFooter>
    </Sidebar>
  )
}
