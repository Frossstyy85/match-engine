import Link from "next/link";
import LogoutButton from "./LogoutButton"
import "./Sidebar.css";
import {useAuth} from "@/lib/hooks";

export default async function Sidebar() {


    let auth =null;

    const NAV_LINKS = [
        { id: 1, label: "🏠 Översikt", href: "/dashboard" },
        { id: 2, label: "👥 Användare", href: "/dashboard/anvandare" },
        { id: 3, label: "🧠 Kompetenser", href: "/dashboard/kompetenser" },
        { id: 4, label: "📁 Projekt", href: "/dashboard/projekt" },
        { id: 5, label: "💼 Team", href: "/dashboard/team" },
        { id: 6, label: "👤 Profil", href: "/dashboard/profile" },
    ];

    return (
        <aside className="sidebar">
            <h3>Matchningssystem</h3>
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
                {auth && (
                    <div className="user-info">
                        Inloggad som<br />
                        {auth.name} ({auth.email})
                    </div>
                )}
                <LogoutButton />
            </div>
        </aside>
    );
}
