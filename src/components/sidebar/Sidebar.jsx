// app/components/Sidebar.tsx
import Link from "next/link";
import LogoutButton from "./LogoutButton"
import { getAuthentication } from "@/lib/auth";
import { JwtUser } from "@/lib/jwt";
import "./Sidebar.css"; // normal CSS import

export default async function Sidebar() {

    const user = {
        name: "fakeName",
        email: "fake@Email.com"
    }


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
                {user && (
                    <div className="user-info">
                        Inloggad som<br />
                        {user.name} ({user.email})
                    </div>
                )}
                <LogoutButton />
            </div>
        </aside>
    );
}
