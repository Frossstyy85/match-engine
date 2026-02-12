import CreateProjectForm from "@/app/dashboard/projects/CreateProjectForm";

export default function ProjectLeadDashboard() {
    return (
        <div className="max-w-[1000px] mx-auto p-5 font-sans text-gray-700 bg-gray-50">
            <h2 className="text-2xl font-bold mb-5 text-gray-900">Projektledare Dashboard</h2>

            <section className="bg-white p-5 rounded-xl mb-5 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Mina projekt</h3>
                <ul className="list-none p-0 m-0">
                    <li className="py-2.5 px-3 border-b border-gray-200 rounded-md last:border-0 hover:bg-gray-100 transition">Match Engine</li>
                    <li className="py-2.5 px-3 border-b border-gray-200 rounded-md last:border-0 hover:bg-gray-100 transition">HR System</li>
                </ul>
                <CreateProjectForm/>
            </section>

            <section className="bg-white p-5 rounded-xl mb-5 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Kompetenskrav</h3>
                <ul className="list-none p-0 m-0">
                    <li className="py-2.5 px-3 border-b border-gray-200 rounded-md last:border-0 hover:bg-gray-100 transition">Java – Advanced</li>
                    <li className="py-2.5 px-3 border-b border-gray-200 rounded-md last:border-0 hover:bg-gray-100 transition">React – Intermediate</li>
                    <li className="py-2.5 px-3 border-b border-gray-200 rounded-md last:border-0 hover:bg-gray-100 transition">SQL – Intermediate</li>
                </ul>
            </section>

            <section className="bg-white p-5 rounded-xl mb-5 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Matchade kandidater</h3>
                <ul className="list-none p-0 m-0">
                    <li className="py-2.5 px-3 border-b border-gray-200 rounded-md last:border-0 hover:bg-gray-100 transition">Anna – 92%</li>
                    <li className="py-2.5 px-3 border-b border-gray-200 rounded-md last:border-0 hover:bg-gray-100 transition">Erik – 85%</li>
                    <li className="py-2.5 px-3 border-b border-gray-200 rounded-md last:border-0 hover:bg-gray-100 transition">Sara – 78%</li>
                </ul>
            </section>
        </div>
    );
}