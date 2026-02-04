"use client";

import Link from "next/link";

export default function UserDashboard() {
    return (
        <div style={{maxWidth: "900px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif"}}>
            <h2 style={{marginBottom: "10px"}}>Profilen har flyttat</h2>
            <p style={{marginBottom: "20px", color: "#6B7280"}}>
                Din profil hanteras nu på profilsidan.
            </p>
            <Link href="/dashboard/profile" style={{color: "#4F46E5", fontWeight: "600"}}>
                Gå till profil
            </Link>
        </div>
    );
}
