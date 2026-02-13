import {createClient} from "@/lib/supabase/server";
import {OverviewBarChart} from "@/components/charts/OverviewBarChart";

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
        <div className="w-full min-w-0 p-3 sm:p-5 font-sans text-gray-700">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 text-gray-900">Admin Dashboard</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mb-4 sm:mb-5">
                <div className="min-w-0 bg-white rounded-xl p-4 shadow-sm text-center transition hover:-translate-y-0.5 hover:shadow-md">
                    <h4 className="font-semibold mb-2 text-gray-600">Users</h4>
                    <p className="text-2xl font-bold text-gray-900">{userCount}</p>
                </div>
                <div className="min-w-0 bg-white rounded-xl p-4 shadow-sm text-center transition hover:-translate-y-0.5 hover:shadow-md">
                    <h4 className="font-semibold mb-2 text-gray-600">Projects</h4>
                    <p className="text-2xl font-bold text-gray-900">{projectCount}</p>
                </div>
                <div className="min-w-0 bg-white rounded-xl p-4 shadow-sm text-center transition hover:-translate-y-0.5 hover:shadow-md">
                    <h4 className="font-semibold mb-2 text-gray-600">Team</h4>
                    <p className="text-2xl font-bold text-gray-900">{teamCount}</p>
                </div>
            </div>

            <div className="mb-4 sm:mb-5 w-full md:w-1/2 min-w-0">
                <OverviewBarChart
                    userCount={userCount ?? 0}
                    projectCount={projectCount ?? 0}
                    teamCount={teamCount ?? 0}
                />
            </div>

            <section className="bg-white p-4 sm:p-5 rounded-xl mb-4 sm:mb-5 shadow-sm min-w-0 overflow-hidden">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">Projects</h3>
                <ul className="list-none p-0 m-0">
                    {projects.map(({id, name}) => (
                        <li key={id} className="py-2.5 px-3 border-b border-gray-200 rounded-md last:border-0 hover:bg-gray-100 transition">{name}</li>
                    ))}
                </ul>
            </section>

            <section className="bg-white p-4 sm:p-5 rounded-xl mb-4 sm:mb-5 shadow-sm min-w-0 overflow-hidden">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">Teams</h3>
                <ul className="list-none p-0 m-0">
                    {teams.map(({id, name}) => (
                        <li key={id} className="py-2.5 px-3 border-b border-gray-200 rounded-md last:border-0 hover:bg-gray-100 transition">{name}</li>
                    ))}
                </ul>
            </section>

            <section className="bg-white p-4 sm:p-5 rounded-xl mb-4 sm:mb-5 shadow-sm min-w-0 overflow-hidden">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 text-gray-800">Users</h3>
                <ul className="list-none p-0 m-0">
                    {users.map(({id, name}) => (
                        <li key={id} className="py-2.5 px-3 border-b border-gray-200 rounded-md last:border-0 hover:bg-gray-100 transition">{name ?? 'no_name_found'}</li>
                    ))}
                </ul>
            </section>

        </div>
    )
}