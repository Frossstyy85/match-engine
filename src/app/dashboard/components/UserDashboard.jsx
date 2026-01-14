export default function UserDashboard() {
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