"use client";

import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";
import styles from "./Sidebar.module.css";
import axios from "axios";

export default function Sidebar(){

    const router = useRouter();
    const pathname = usePathname();

    const NAV_LINKS = [
        { id: 1, label: "Home", href: "/dashboard" },
        { id: 2, label: "profile", href: "/dashboard/profile" },
        { id: 3, label: "teams", href: "/dashboard/teams" },
        { id: 4, label: "projects", href: "/dashboard/projects"}
    ];

    const handleLogout = async () => {
        try {
            await axios.post("/api/logout");
            router.push("/");
            router.refresh();
        } catch (e) {}
    }


    return (
        <nav className={styles.sidebar}>
            <div className={styles.brand}>
                <div className={styles.logoMark} aria-hidden="true" />
                <div className={styles.brandText}>
                    <div className={styles.brandName}>Engine</div>
                    <div className={styles.brandSub}>Dashboard</div>
                </div>
            </div>
            <ul className={styles.nav}>
                {NAV_LINKS.map((link) => (
                    <li key={link.id}>
                        <Link
                            href={link.href}
                            className={[
                                styles.link,
                                (pathname === link.href || (link.href !== "/dashboard" && pathname?.startsWith(link.href)))
                                    ? styles.active
                                    : ""
                            ].join(" ")}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className={styles.footer}>
                <button className={styles.logout} onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    )





}