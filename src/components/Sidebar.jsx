
import Link from "next/link";
import styles from "./Sidebar.module.css";
import LogoutButton from "@/components/auth/LogoutButton";

export default function Sidebar(){

    const NAV_LINKS = [
        { id: 1, label: "Home", href: "/dashboard" },
        { id: 2, label: "profile", href: "/dashboard/profile" },
    ];

    return (
            <nav className={styles.sidebar}>
                <ul className={styles.list}>
                    {NAV_LINKS.map((link) => (
                        <li className={styles.link} key={link.id}>
                            <Link className={styles.linkText} href={link.href}>{link.label}</Link>
                        </li>
                    ))}
                </ul>
                <LogoutButton/>
            </nav>
    )
}