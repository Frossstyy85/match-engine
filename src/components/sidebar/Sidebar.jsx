import Link from "next/link";
import LogoutButton from "./LogoutButton"
import "./Sidebar.css";

export default async function Sidebar() {

    const NAV_LINKS = [
        {id: 1, label: "Dashboard", href: "/dashboard"},
        {id: 2, label: "Users", href: "/dashboard/users"},
        {id: 3, label: "Skills", href: "/dashboard/skills"},
        {id: 4, label: "Projects", href: "/dashboard/projects"},
        {id: 5, label: "Teams", href: "/dashboard/teams"},
        {id: 6, label: "Profile", href: "/dashboard/profile"},
    ];

    return (
        <aside className="sidebar">
            <Link href={"/dashboard"}>
                <h3>Welcome</h3>
            </Link>

            <ul className="nav-list">
                {NAV_LINKS.map((link) => (
                    <li key={link.id} className="nav-item">
                        <Link className="nav-link" href={link.href}>
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="sidebar-footer">
                <LogoutButton/>
            </div>
        </aside>
    );
}
