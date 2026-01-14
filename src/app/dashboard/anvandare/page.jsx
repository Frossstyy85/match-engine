"use client";

import React, { useEffect, useState } from "react";
import "./page.css";
import {useQuery} from "@apollo/client/react";
import {gql} from "graphql-tag";

export default function Anvandare() {


    const { data, loading, error } = useQuery(gql` query {users { id  name email } }`)

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    const { users } = data;


    return (
        <div className="projekt-container">
            <h2>👥 Användare</h2>
            <table className="projekt-table">
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
