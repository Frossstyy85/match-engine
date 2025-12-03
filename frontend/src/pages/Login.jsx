import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            setError("Felaktig email eller lösenord");
            return;
        }

        localStorage.setItem("user", JSON.stringify({ email: user.email }));
        navigate("/");
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Logga in</h2>
                {error && <p className="auth-error">{error}</p>}

                <form onSubmit={handleLogin}>
                    <label>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    <label>Lösenord</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="submit">Logga in</button>
                </form>

                <p>
                    Har du inget konto? <a href="/register">Registrera dig</a>
                </p>
            </div>
        </div>
    );
}
