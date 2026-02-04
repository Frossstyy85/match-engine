import CreateProjectForm from "@/app/dashboard/projects/CreateProjectForm";

export default function ProjectLeadDashboard() {
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
                <CreateProjectForm/>
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