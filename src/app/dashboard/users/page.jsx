import "@/components/table/table.css";

export default function Page() {

    return null;


    return (
        <div>
            <h2>Användare</h2>
            <table className="table">
                <thead>
                <tr>
                    <th>Namn</th>
                    <th>Email</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
