import "@/components/table/table.css";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
    const supabase = await createClient();

    const [
        { count: projectCount },
        { count: userCount },
        { count: teamCount },
        { data: latestProjects },
        { data: latestUsers },
        { data: latestTeams },
    ] = await Promise.all([
        supabase.from("projects").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("teams").select("*", { count: "exact", head: true }),
        supabase
            .from("projects")
            .select("id,name,created_at")
            .order("created_at", { ascending: false })
            .limit(3),
        supabase
            .from("profiles")
            .select("id,name,email,created_at")
            .order("created_at", { ascending: false })
            .limit(3),
        supabase
            .from("teams")
            .select("id,name,created_at")
            .order("created_at", { ascending: false })
            .limit(3),
    ]);

    // Temporary hard-coded match results
    const hardcodedMatches = [
        {
            user: "Alice Johnson",
            project: "AI Matching Engine",
            score: 92,
            reason: "Strong skills match and full availability",
        },
        {
            user: "Bob Smith",
            project: "Internal Tools Migration",
            score: 78,
            reason: "Good experience, limited availability",
        },
        {
            user: "Charlie Lee",
            project: "Onboarding Portal",
            score: 64,
            reason: "Missing one required skill",
        },
    ];

    const maxCount = Math.max(
        projectCount ?? 0,
        userCount ?? 0,
        teamCount ?? 0,
        1,
    );

    const cards = [
        {
            label: "Projects",
            value: projectCount ?? 0,
            href: "/dashboard/projects",
            color: "bg-blue-500",
        },
        {
            label: "Users",
            value: userCount ?? 0,
            href: "/dashboard/users",
            color: "bg-emerald-500",
        },
        {
            label: "Teams",
            value: teamCount ?? 0,
            href: "/dashboard/teams",
            color: "bg-purple-500",
        },
    ];

    return (
        <div className={"w-full h-screen flex justify-center bg-gray-50"}>
            <div className={"flex flex-col gap-6 w-full max-w-4/5 h-fit mt-5 mb-5"}>
                <header className={"flex items-baseline justify-between"}>
                    <div>
                        <h1 className={"text-3xl font-semibold"}>Admin dashboard</h1>
                        <p className={"text-sm text-gray-500"}>
                            Overview of users, projects, and teams.
                        </p>
                    </div>
                </header>

                <section className={"grid grid-cols-1 md:grid-cols-3 gap-4"}>
                    {cards.map((card) => (
                        <Link
                            key={card.label}
                            href={card.href}
                            className={
                                "flex flex-col justify-between rounded-lg border border-gray-200 bg-white shadow-sm p-4 hover:shadow-md transition-shadow"
                            }
                        >
                            <div className={"flex items-center justify-between mb-2"}>
                                <p className={"text-sm text-gray-500"}>{card.label}</p>
                            </div>
                            <div className={"flex items-baseline justify-between"}>
                                <p className={"text-3xl font-semibold"}>
                                    {card.value}
                                </p>
                            </div>
                        </Link>
                    ))}
                </section>

                <section className={"rounded-lg border border-gray-200 bg-white shadow-sm p-4"}>
                    <div className={"flex items-center justify-between mb-4"}>
                        <h2 className={"text-lg font-semibold"}>Distribution</h2>
                        <p className={"text-xs text-gray-500"}>
                            Simple bar chart of counts per category.
                        </p>
                    </div>

                    <div
                        className={"flex items-end gap-6"}
                        style={{ minHeight: "180px" }}
                    >
                        {cards.map((card) => {
                            const ratio =
                                maxCount > 0 ? (card.value ?? 0) / maxCount : 0;
                            const barHeightPx = 40 + ratio * 100; // always at least 40px

                            return (
                                <div
                                    key={card.label}
                                    className={"flex flex-col items-center gap-2 flex-1"}
                                >
                                    <div
                                        className={
                                            "w-8 rounded-t-md " + card.color
                                        }
                                        style={{
                                            height: `${barHeightPx}px`,
                                            borderRadius: "6px",
                                        }}
                                    />
                                    <p className={"text-xs text-gray-500"}>
                                        {card.label}
                                    </p>
                                    <p className={"text-xs text-gray-400"}>
                                        {card.value}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <div className={"mt-4 text-xs text-gray-500 space-y-1"}>
                        <p>Projects = total number of created projects.</p>
                        <p>Users = total number of created user profiles.</p>
                        <p>Teams = total number of created teams.</p>
                    </div>
                </section>

                <section className={"rounded-lg border border-gray-200 bg-white shadow-sm p-4 text-sm"}>
                    <div className={"flex items-center justify-between mb-4"}>
                        <h2 className={"text-lg font-semibold"}>Top match results</h2>
                        <p className={"text-xs text-gray-500"}>
                            Overview of the strongest matches between users and projects.
                        </p>
                    </div>

                    <table className={"table text-sm"}>
                        <thead>
                        <tr>
                            <th>User</th>
                            <th>Project</th>
                            <th>Match %</th>
                            <th>Reason</th>
                        </tr>
                        </thead>
                        <tbody>
                        {hardcodedMatches.map((m) => (
                            <tr key={`${m.user}-${m.project}`}>
                                <td>{m.user}</td>
                                <td>{m.project}</td>
                                <td>{m.score}%</td>
                                <td>{m.reason}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>


                <section className={"rounded-lg border border-gray-200 bg-white shadow-sm p-4"}>
                    <div className={"flex items-center justify-between mb-4"}>
                        <h2 className={"text-lg font-semibold"}>Recent activity</h2>
                        <p className={"text-xs text-gray-500"}>
                            Latest created projects, users, and teams.
                        </p>
                    </div>

                    <div className={"grid grid-cols-1 md:grid-cols-3 gap-4 text-sm"}>
                        <div>
                            <h3 className={"font-medium mb-2"}>Projects</h3>
                            <ul className={"space-y-1 text-gray-600"}>
                                {(latestProjects ?? []).map((p: any) => (
                                    <li key={p.id}>
                                        New project created:{" "}
                                        <span className={"font-medium"}>{p.name}</span>
                                    </li>
                                ))}
                                {(!latestProjects || latestProjects.length === 0) && (
                                    <li className={"text-gray-400"}>No recent projects.</li>
                                )}
                            </ul>
                        </div>

                        <div>
                            <h3 className={"font-medium mb-2"}>Users</h3>
                            <ul className={"space-y-1 text-gray-600"}>
                                {(latestUsers ?? []).map((u: any) => (
                                    <li key={u.id}>
                                        User added:{" "}
                                        <span className={"font-medium"}>{u.email ?? u.name}</span>
                                    </li>
                                ))}
                                {(!latestUsers || latestUsers.length === 0) && (
                                    <li className={"text-gray-400"}>No recent users.</li>
                                )}
                            </ul>
                        </div>

                        <div>
                            <h3 className={"font-medium mb-2"}>Teams</h3>
                            <ul className={"space-y-1 text-gray-600"}>
                                {(latestTeams ?? []).map((t: any) => (
                                    <li key={t.id}>
                                        Team created:{" "}
                                        <span className={"font-medium"}>{t.name}</span>
                                    </li>
                                ))}
                                {(!latestTeams || latestTeams.length === 0) && (
                                    <li className={"text-gray-400"}>No recent teams.</li>
                                )}
                            </ul>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

