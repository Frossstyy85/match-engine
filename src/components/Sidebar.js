
import Link from "next/link";
import styles from "./Sidebar.module.css";
import LogoutButton from "@/components/auth/LogoutButton";

export default function Sidebar(){


    const NAV_LINKS = [
        { id: 1, label: "Home", href: "/dashboard" },
        { id: 2, label: "profile", href: "/dashboard/profile" },
        { id: 3, label: "teams", href: "/dashboard/teams" },
        { id: 4, label: "projects", href: "/dashboard/projects"}
    ];



    return (
            <nav className={styles.sidebar}>
                <ul>
                    {NAV_LINKS.map((link) => (
                        <li className={styles.link} key={link.id}>
                            <Link href={link.href}>{link.label}</Link>
                        </li>
                    ))}
                </ul>
                <LogoutButton/>
            </nav>
    )





}