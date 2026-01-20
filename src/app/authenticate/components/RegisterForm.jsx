"use client";


import {useState} from "react";
import {useRouter} from "next/navigation";
import InputField from "@/components/InputField";
import styles from "./AuthModal.module.css"

const RegisterForm = ({onSwitch}) => {
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

            const res1 = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email, name, password}),
                credentials: "include"
            });

            if (!res1.ok) {
                const data = await res1.json();
                throw new Error(data?.message);
            }

            const res2 = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email, password}),
                credentials: "include"
            });

            if (!res2.ok) {
                const data = await res2.json();
                throw new Error(data?.message);
            }


            router.push('/dashboard');

        } catch (err) {
            setError(err.message || "Network error")
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Register</h2>
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

export default RegisterForm;

