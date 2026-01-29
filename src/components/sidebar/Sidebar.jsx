"use client"

import Link from "next/link"
import "./Sidebar.css"

const items = [
    {title: 'Dashboard', url: '/dashboard'},
    {title: 'Projects', url: '/dashboard/projects'},
    {title: 'Teams', url: '/dashboard/teams'},
    {title: 'Users', url: '/dashboard/users'},
    {title: 'Skills', url: '/dashboard/skills'},
    {title: 'Profile', url: '/dashboard/profile'},
]

export default function Sidebar() {

    return (
        <aside className="sidebar">
            <h3>App</h3>
            <nav>
                <ul>
                    {items.map(item => (
                        <li key={item.title}>
                            <Link href={item.url} className={`nav-link`}>
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    )
}