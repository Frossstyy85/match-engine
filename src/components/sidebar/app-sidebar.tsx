"use client"

import * as React from "react"
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";


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
                                <SidebarMenuButton asChild className={"hover:bg-blue-500"}>
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
