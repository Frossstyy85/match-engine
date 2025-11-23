import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Anvandare() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Exempeldata – byt till API-anrop senare
        setUsers([
            { id: 1, name: "Caroline", email: "caroline@test.se" },
            { id: 2, name: "Anders", email: "anders@test.se" },
        ]);
    }, []);

    return (
        <div className="p-4">
            <h2>👥 Användare</h2>
            <table className="table table-striped mt-3">
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
