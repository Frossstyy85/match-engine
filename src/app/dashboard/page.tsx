"use server";

// Import the components we want to render on the dashboard

// import component from "@/app/dashboard/components/component

import { getAuthentication } from "@/lib/auth";
import { JwtUser } from "@/lib/jwt";
import "./dashboard.css"

/**
 * DashboardPage is a Server Component.
 * It fetches the authenticated user info and renders different content
 * based on the user’s role.
 */
export default async function DashboardPage() {
    // -------------------------------
    // 1️⃣ Get authenticated user
    // -------------------------------
    // This calls your auth library and returns user info decoded from JWT
    const auth: JwtUser = await getAuthentication();

    // -------------------------------
    // 2️⃣ Extract the role from the authenticated user
    // -------------------------------
    const userRole = "ADMIN"

    // -------------------------------
    // 3️⃣ Conditional rendering by role
    // -------------------------------
    if (userRole === "ADMIN") {
        // ✅ If the user is an admin, show admin dashboard
        // You can add more components here for admin-specific views
        return (
            <div className="dashboard-container">
                <h2>Admin Dashboard</h2>
                {/* 🔢 Stats */}
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <h4>Användare</h4>
                        <p>128</p>
                    </div>
                    <div className="stat-card">
                        <h4>Projekt</h4>
                        <p>12</p>
                    </div>
                    <div className="stat-card">
                        <h4>Team</h4>
                        <p>6</p>
                    </div>
                </div>

                {/* 📋 Senaste projekt */}
                <section className="dashboard-section">
                    <h3>Projekt</h3>
                    <ul className="dashboard-list">
                        <li>Match Engine</li>
                        <li>HR System</li>
                        <li>School Platform</li>
                    </ul>
                </section>

                {/* 👥 Senaste team */}
                <section className="dashboard-section">
                    <h3>Team</h3>
                    <ul className="dashboard-list">
                        <li>Backend Team</li>
                        <li>Frontend Team</li>
                        <li>DevOps Team</li>
                    </ul>
                </section>
            </div>
        );
    }

    // -------------------------------
    // 4️⃣ USER view
    // -------------------------------
    // You can render a simpler view for normal users
    if (userRole === "USER") {
        return (
            <div className="dashboard-container">
                <h2>Min profil</h2>

                <section>
                    <h3>Kunskaper & Kompetenser</h3>
                    <button>Lägg till</button>
                </section>

                <section>
                    <h3>Certifikat</h3>
                    <button>Lägg till certifikat</button>
                </section>

                <section>
                    <h3>Språk</h3>
                    <button>Lägg till språk</button>
                </section>

                <section>
                    <h3>Tillgänglighet</h3>
                    <button>Uppdatera</button>
                </section>
            </div>
        );
    }
    // 4️⃣ HR view
// -------------------------------
    if (userRole === "HR") {
        return (
            <div className="dashboard-container">
                <h2>HR Dashboard</h2>

                {/* 📊 Bemanning */}
                <section className="dashboard-section">
                    <h3>Bemanningsgrad</h3>
                    <ul className="dashboard-list">
                        <li>Backend Team – 80%</li>
                        <li>Frontend Team – 65%</li>
                        <li>DevOps Team – 90%</li>
                    </ul>
                </section>

                {/* 🧠 Kompetensöversikt */}
                <section className="dashboard-section">
                    <h3>Kompetensöversikt</h3>
                    <ul className="dashboard-list">
                        <li>Java – 24 personer</li>
                        <li>React – 18 personer</li>
                        <li>SQL – 30 personer</li>
                    </ul>
                </section>

                {/* 📈 Matchningar */}
                <section className="dashboard-section">
                    <h3>Matchningsresultat</h3>
                    <p>Visa topprankade kandidater per projekt</p>
                </section>
            </div>
        );
    }
// 5️⃣ PROJECT LEAD view
// -------------------------------
    if (userRole === "PROJECT_LEAD") {
        return (
            <div className="dashboard-container">
                <h2>Projektledare Dashboard</h2>

                {/* 📁 Projekt */}
                <section className="dashboard-section">
                    <h3>Mina projekt</h3>
                    <ul className="dashboard-list">
                        <li>Match Engine</li>
                        <li>HR System</li>
                    </ul>
                    <button>Skapa nytt projekt</button>
                </section>

                {/* 🎯 Kompetenskrav */}
                <section className="dashboard-section">
                    <h3>Kompetenskrav</h3>
                    <ul className="dashboard-list">
                        <li>Java – Advanced</li>
                        <li>React – Intermediate</li>
                        <li>SQL – Intermediate</li>
                    </ul>
                </section>

                {/* 🤝 Matchade kandidater */}
                <section className="dashboard-section">
                    <h3>Matchade kandidater</h3>
                    <ul className="dashboard-list">
                        <li>Anna – 92%</li>
                        <li>Erik – 85%</li>
                        <li>Sara – 78%</li>
                    </ul>
                </section>
            </div>
        );
    }


    // -------------------------------
    // 5️⃣ Fallback: unknown role or unauthenticated
    // -------------------------------
    return (
        <div className="dashboard-container">
            <h2>Access Denied</h2>
            <p>You do not have permission to view this page.</p>
        </div>
    );
}
