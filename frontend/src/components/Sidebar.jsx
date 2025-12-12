import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";   // ⬅️ lägg till denna

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            navigate("/login");
        }
    };

    return (
        <aside className="sidebar">
            <h3>Matchningssystem</h3>

            <ul className="nav flex-column">
                <li className="nav-item mb-2">
                    <NavLink className="nav-link" to="/">🏠 Översikt</NavLink>
                </li>

                <li className="nav-item mb-2">
                    <NavLink className="nav-link" to="/anvandare">👥 Användare</NavLink>
                </li>

                <li className="nav-item mb-2">
                    <NavLink className="nav-link" to="/kompetenser">🧠 Kompetenser</NavLink>
                </li>

                <li className="nav-item mb-2">
                    <NavLink className="nav-link" to="/projekt">📁 Projekt</NavLink>
                </li>

                <li className="nav-item mb-2">
                    <NavLink className="nav-link" to="/team">💼 Team</NavLink>
                </li>

                <li className="nav-item mb-2">
                    <NavLink className="nav-link" to="/profile">👤 Profil</NavLink>
                </li>
            </ul>

            <div style={{ marginTop: "auto", paddingTop: 16 }}>
                {user && <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 8 }}>Inloggad som<br />{user.name} ({user.email})</div>}
                <button className="nav-link" onClick={handleLogout} style={{ background: "none", border: 0, padding: 0, cursor: "pointer", color: "inherit" }}>
                    🚪 Logga ut
                </button>
            </div>
        </aside>
    );
}
