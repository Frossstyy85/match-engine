"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import LogoutButton from "@/components/auth/LogoutButton";

const items = [
    { title: "Dashboard", url: "/dashboard" },
    { title: "Projects", url: "/dashboard/projects" },
    { title: "Teams", url: "/dashboard/teams" },
    { title: "Users", url: "/dashboard/users" },
    { title: "Skills", url: "/dashboard/skills" },
    { title: "Profile", url: "/dashboard/profile" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed top-0 left-0 bottom-0 w-[300px] h-screen overflow-y-auto bg-gray-800 text-white p-6 flex flex-col shadow-lg z-50 md:w-[300px] md:p-6">
            <h3 className="text-xl font-bold text-gray-100 mb-6 tracking-wide uppercase pl-3 relative before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-[5px] before:bg-blue-600 before:rounded-sm md:block">
                Match Engine
            </h3>
            <nav>
                <ul className="list-none p-0 m-0">
                    {items.map((item) => (
                        <li key={item.title} className="mb-2.5">
                            <Link
                                href={item.url}
                                prefetch="auto"
                                className={cn(
                                    "block no-underline text-gray-300 py-2.5 px-3.5 rounded-lg text-lg transition",
                                    pathname === item.url
                                        ? "bg-blue-500 text-white font-semibold"
                                        : "hover:bg-blue-600 hover:text-white hover:translate-x-0.5"
                                )}
                            >
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
                <LogoutButton />
            </nav>
        </aside>
    );
}