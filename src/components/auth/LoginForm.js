"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginForm({ onSwitch }) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isPristine = email === "" && password === "";

    const clearFields = () => {
        setError(null);
        setEmail("");
        setPassword("");
    }

    const handleSubmit = async (e) => {
      setLoading(true);
      setError(null);
      e.preventDefault();

      try {

          await axios.post("/api/login", { email: email, password: password });
          router.push("/dashboard");

      } catch (err) {
          setError(err?.response?.data.message || err.message || "Login failed");
      } finally {
          setLoading(false);
      }

    }


    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <div>
                        <span>Email</span>
                        <input
                            value={email}
                            onChange={(e) => {
                                setError(null);
                                setEmail(e.target.value);
                            }}
                            placeholder="name@company.com"
                            type="text"
                            autoComplete="email"
                        />
                    </div>
                    <div>
                        <span>Password</span>
                        <input
                            value={password}
                            onChange={(e) => {
                                setError(null);
                                setPassword(e.target.value);
                            }}
                            placeholder="Create a password"
                            type="password"
                            autoComplete="new-password"
                        />
                    </div>
                </div>
                <div>
                    {!isPristine && <button type={"button"} onClick={clearFields}>clear</button>}
                    <button type={"submit"} disabled={!email || !password}>
                        Login
                    </button>
                </div>
            </form>
            <div>
                <button onClick={onSwitch}>
                    Dont have a account?
                </button>
            </div>
        </div>
    )
}


