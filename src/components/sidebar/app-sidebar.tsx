'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import { Folders, LayoutDashboard, Lightbulb, User, UserRoundPen, UsersRound } from 'lucide-react'

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
import { LogoutButton } from '../auth/logout-button'

type NavigationItem = {
  title: string
  url: string
  icon: LucideIcon
}

const navigationItems: NavigationItem[] = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Projects', url: '/dashboard/projects', icon: Folders },
  { title: 'Teams', url: '/dashboard/teams', icon: UsersRound },
  { title: 'Skills', url: '/dashboard/skills', icon: Lightbulb },
  { title: 'Users', url: '/dashboard/users', icon: User },
  { title: 'Profile', url: '/dashboard/profile', icon: UserRoundPen }
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>Match engine</SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navigationItems.map((item) => {
              const Icon = item.icon

              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url || (item.url !== '/dashboard' && pathname.startsWith(item.url))}
                  >
                    <Link href={item.url}>
                      <Icon className='size-4' />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  )
}
