"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/InputField";
import styles from "./AuthModal.module.css"

const LoginForm =  ({ onSwitch, redirectUri }) => {

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

            const res1 = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password }),
                credentials: "include"
            });

            if (!res1.ok) {
                const data = await res1.json();
                throw new Error(data?.message);
            }

            router.push(redirectUri);

        } catch (err) {
            setError(err.message || "Network error")
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <h2>Login</h2>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className={styles.inputArea}>
                    <div>
                        <InputField
                            type={"email"}
                            label={"EMAIL"}
                            onChange={(e) => {
                                setError(null)
                                setEmail(e.target.value)
                            }}
                            value={email}
                        />
                    </div>
                    <div>
                       <InputField
                           type={"password"}
                           label={"PASSWORD"}
                           onChange={(e) => {
                               setError(null)
                               setPassword(e.target.value)
                           }}
                           value={password}
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

export default LoginForm;


