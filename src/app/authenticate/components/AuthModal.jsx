"use client";

import {useState} from "react";
import LoginForm from "@/app/authenticate/components/LoginForm";
import RegisterForm from "@/app/authenticate/components/RegisterForm";
import styles from "./AuthModal.module.css";

export default function AuthModal() {
    const [mode, setMode] = useState("login");

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.formWrapper}>
                    {mode === "login" && <LoginForm onSwitch={() => setMode("register")}/>}
                    {mode === "register" && <RegisterForm onSwitch={() => setMode("login")}/>}
                </div>
            </div>
        </div>
    );
}
