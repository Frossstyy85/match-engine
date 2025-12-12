import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await register(name, email, password);
      if (res.ok) {
        setMessage(res.message || "Konto skapat!");
        navigate("/login");
      } else {
        setError(res.message || "Kunde inte skapa konto");
      }
    } catch (e) {
      setError(e.message || "Kunde inte skapa konto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Registrera dig</h2>
        {message && <p className="auth-message">{message}</p>}
        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleRegister}>
          <label>Namn</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Lösenord</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>
            {loading ? "Skapar..." : "Registrera"}
          </button>
        </form>

        <p>
          Har du redan konto? <Link to="/login">Logga in</Link>
        </p>
      </div>
    </div>
  );
}
