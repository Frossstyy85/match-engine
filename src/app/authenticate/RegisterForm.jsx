"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import InputField from "@/components/InputField";
import styles from "./AuthModal.module.css"

export default function RegisterForm({ onSwitch, redirectUri } ) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isPristine = name === "" && email === "" && password === "";


  const clearFields = () => {
      setName("");
      setEmail("");
      setPassword("");
  }

  const handleSubmit = async (e) => {
    setLoading(true);
    setError(null);
    e.preventDefault();

    try {

        await axios.post("/api/register", { email, name, password });
        await axios.post("/api/login", { email, password });

        router.push(redirectUri);

    } catch (err) {
        setError(err.response?.data?.message || err.message || "Something went wrong")
    } finally {
        setLoading(false);
    }
  };

  return (
      <div>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          <form onSubmit={handleSubmit}>
              <div className={styles.inputArea}>
                      <InputField
                          label={"EMAIL"}
                          value={email}
                          type={"email"}
                          onChange={(e) => {
                              setError(null);
                              setEmail(e.target.value)
                          }}
                      />
                      <InputField
                          label={"NAME"}
                          value={name}
                          type={"text"}
                          onChange={(e) => {
                              setError(null);
                              setName(e.target.value)
                          }}
                      />
                      <InputField
                          label={"PASSWORD"}
                          value={password}
                          type={"password"}
                          onChange={(e) => {
                              setError(null);
                              setPassword(e.target.value)
                          }}
                      />
              </div>
          <div>
              {!isPristine && <button type={"button"} onClick={clearFields}>clear</button>}
              <button type={"submit"} disabled={!name || !email || !password}>
                  Register
              </button>
          </div>
          </form>
          <div>
              <button onClick={onSwitch}>
                  Already have an account? Sign in
              </button>
          </div>
      </div>
  );
}

