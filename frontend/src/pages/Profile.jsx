import React, { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const canSubmit = useMemo(() => {
    if (!user) return false;
    const changedBasic = name !== (user.name || "") || email !== (user.email || "");
    const passwordEntered = password.trim().length > 0;
    return changedBasic || passwordEntered;
  }, [name, email, password, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!user) return;
    const payload = {};
    if (name !== user.name) payload.name = name;
    if (email !== user.email) payload.email = email;
    if (password.trim()) payload.password = password.trim();

    setSaving(true);
    try {
      const res = await updateProfile(payload);
      if (res.ok) {
        setMessage("Profil uppdaterad");
        setPassword("");
      } else {
        setError(res.message || "Kunde inte uppdatera profil");
      }
    } catch (e) {
      setError(e.message || "Kunde inte uppdatera profil");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="auth-container">
        <div className="auth-box" style={{ maxWidth: 480 }}>
          <h2>Profil</h2>
          {message && <p className="auth-message">{message}</p>}
          {error && <p className="auth-error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label>Namn</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Nytt lösenord (valfritt)</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" disabled={saving || !canSubmit}>
              {saving ? "Sparar..." : "Spara"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
