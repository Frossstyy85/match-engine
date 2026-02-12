export default function HrDashboard() {
    return (
        <div className="max-w-[1000px] mx-auto p-5 font-sans text-gray-700 bg-gray-50">
            <h2 className="text-2xl font-bold mb-5 text-gray-900">HR Dashboard</h2>

            <section className="bg-white p-5 rounded-xl mb-5 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Bemanningsgrad</h3>
                <ul className="list-none p-0 m-0">
                    <li className="py-2.5 px-3 border-b border-gray-200 rounded-md last:border-0 hover:bg-gray-100 transition">Backend Team – 80%</li>
                    <li className="py-2.5 px-3 border-b border-gray-200 rounded-md last:border-0 hover:bg-gray-100 transition">Frontend Team – 65%</li>
                    <li className="py-2.5 px-3 border-b border-gray-200 rounded-md last:border-0 hover:bg-gray-100 transition">DevOps Team – 90%</li>
                </ul>
            </section>

            <section className="bg-white p-5 rounded-xl mb-5 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Kompetensöversikt</h3>
                <ul className="list-none p-0 m-0">
                    <li className="py-2.5 px-3 border-b border-gray-200 rounded-md last:border-0 hover:bg-gray-100 transition">Java – 24 personer</li>
                    <li className="py-2.5 px-3 border-b border-gray-200 rounded-md last:border-0 hover:bg-gray-100 transition">React – 18 personer</li>
                    <li className="py-2.5 px-3 border-b border-gray-200 rounded-md last:border-0 hover:bg-gray-100 transition">SQL – 30 personer</li>
                </ul>
            </section>

            <section className="bg-white p-5 rounded-xl mb-5 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Matchningsresultat</h3>
                <p>Visa topprankade kandidater per projekt</p>
            </section>
        </div>
    )
}