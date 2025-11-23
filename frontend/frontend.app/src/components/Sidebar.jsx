import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <aside className="bg-dark text-white p-3" style={{ width: "260px", minHeight: "100vh" }}>
            <h3 className="mb-4">Matchningssystem</h3>
            <ul className="nav flex-column">
                <li className="nav-item mb-2"><Link className="nav-link text-white" to="/">🏠 Översikt</Link></li>
                <li className="nav-item mb-2"><Link className="nav-link text-white" to="/anvandare">👥 Användare</Link></li>
                <li className="nav-item mb-2"><Link className="nav-link text-white" to="/kompetenser">🧠 Kompetenser</Link></li>
                <li className="nav-item mb-2"><Link className="nav-link text-white" to="/projekt">📁 Projekt</Link></li>
                <li className="nav-item"><Link className="nav-link text-white" to="/team">💼 Team</Link></li>
            </ul>
        </aside>
    );
}
