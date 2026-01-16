"use client";

import React, { useEffect, useState } from "react";
import "@/components/table/table.css";
import {useGraph} from "@/lib/hooks";

export default function Anvandare() {

    const query = 'query { users { id name email } }'

    const { data, loading, error } = useGraph(query);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const { users } = data;


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
