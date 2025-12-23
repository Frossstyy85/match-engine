"use client";
import styles from "./Sidebar.module.css";

export default function LogoutButton() {
    const handleLogout = async () => {
        await fetch("/api/logout", { method: "POST" });
        window.location.href = "/login";
    };

    return (
        <button
            className={styles.logoutButton}
            onClick={handleLogout}
        >
            Logga ut
        </button>
    );
}
