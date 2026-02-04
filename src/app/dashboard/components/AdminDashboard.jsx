import {createClient} from "@/lib/supabase/server";

export default async function AdminDashboard() {

    const supabase = await createClient();

    const {data: users, count: userCount} = await supabase
        .from('profiles')
        .select(`id, name`, {count: "estimated"})
    const {data: teams, count: teamCount} = await supabase
        .from('teams')
        .select(`id, name`, {count: "estimated"})
    const {data: projects, count: projectCount} = await supabase
        .from('projects')
        .select(`id, name`, {count: "estimated"})


    return (
        <div className="dashboard-container">
            <h2>Admin Dashboard</h2>

            <div className="dashboard-stats">
                <div className="stat-card">
                    <h4>Users</h4>
                    <p>{userCount}</p>
                </div>
                <div className="stat-card">
                    <h4>Projects</h4>
                    <p>{projectCount}</p>
                </div>
                <div className="stat-card">
                    <h4>Team</h4>
                    <p>{teamCount}</p>
                </div>
            </div>

            <section className="dashboard-section">
                <h3>Projects</h3>
                <ul className="dashboard-list">
                    {projects.map(({id, name}) => (
                        <li key={id}>{name}</li>
                    ))}
                </ul>
            </section>

            <section className="dashboard-section">
                <h3>Teams</h3>
                <ul className="dashboard-list">
                    {teams.map(({id, name}) => (
                        <li key={id}>{name}</li>
                    ))}
                </ul>
            </section>

            <section className="dashboard-section">
                <h3>Users</h3>
                <ul className="dashboard-list">
                    {users.map(({id, name}) => (
                        <li key={id}>{name ?? 'no_name_found'}</li>
                    ))}
                </ul>
            </section>

        </div>
    )
}