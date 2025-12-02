import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem("users")) || [];

        if (users.find(u => u.email === email)) {
            setMessage("Email finns redan");
            return;
        }

        users.push({ name, email, password });
        localStorage.setItem("users", JSON.stringify(users));
        setMessage("Konto skapat!");
        navigate("/login");
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Registrera dig</h2>
                {message && <p className="auth-message">{message}</p>}

                <form onSubmit={handleRegister}>
                    <label>Namn</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required />
                    <label>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <label>Lösenord</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit">Registrera</button>
                </form>

                <p>
                    Har du redan konto? <a href="/login">Logga in</a>
                </p>
            </div>
        </div>
    );
}
