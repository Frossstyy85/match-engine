"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import InputField from "@/components/InputField";
import styles from "./AuthModal.module.css"

export default function LoginForm({ onSwitch, redirectUri }) {
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
          router.push(redirectUri);

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


