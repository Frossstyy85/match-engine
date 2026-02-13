"use client"

import * as React from "react"
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import LogoutButton from "@/components/auth/LogoutButton"


const items = [
    {
        title: "dashboard",
        url: "/dashboard"
    },
    {
        title: "projects",
        url: "/dashboard/projects"
    },
    {
        title: "teams",
        url: "/dashboard/teams"
    },
    {
        title: "skills",
        url: "/dashboard/skills"
    },
    {
        title: "users",
        url: "/dashboard/users"
    },
    {
        title: "profile",
        url: "/dashboard/profile"
    }

]


export function AppSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar>
            <SidebarHeader>
                Match engine
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {items.map((item, idx) => (
                            <SidebarMenuItem key={idx}>
                                <SidebarMenuButton asChild isActive={pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(item.url))}>
                                    <Link href={item.url}>
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <LogoutButton/>
            </SidebarFooter>
        </Sidebar>
    )
}
