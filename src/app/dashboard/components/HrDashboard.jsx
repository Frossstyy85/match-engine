export default function HrDashboard() {
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
    )
}