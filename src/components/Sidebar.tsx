import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { cookies } from "next/headers";
import { User } from "@/lib/types";
import { getSession } from "@/lib/session";
import styles from "./Sidebar.module.css";

export default async function Sidebar() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("sessionId")?.value;

    const user: User | null = sessionId
        ? (await getSession(sessionId))?.user ?? null
        : null;

    const navLinks = [
        { href: "/", label: "Översikt" },
        { href: "/anvandare", label: "Användare" },
        { href: "/kompetenser", label: "Kompetenser" },
        { href: "/projekt", label: "Projekt" },
        { href: "/team", label: "Team" },
        { href: "/profile", label: "Profil" },
    ];

    return (
        <aside className={styles.sidebar}>
            <h3 className={styles.title}>Matchningssystem</h3>

            <ul>
                {navLinks.map((link) => (
                    <li key={link.href}>
                        <Link
                            href={link.href}
                            className={styles.navLink}
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>

            <div className={styles.footer}>
                <div className={styles.footerContent}>
                    {user ? (
                        <>
                            <div className={styles.userInfo}>
                                Inloggad som<br />{user.name} ({user.email})
                            </div>
                            <LogoutButton />
                        </>
                    ) : (
                        <Link href="/login" className={styles.loginButton}>
                            Logga in
                        </Link>
                    )}
                </div>
            </div>


        </aside>
    );
}
