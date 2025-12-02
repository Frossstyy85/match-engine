import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";   // ⬅️ lägg till denna

export default function Sidebar() {
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
            </ul>
        </aside>
    );
}
