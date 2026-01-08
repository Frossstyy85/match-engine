"use client";

import { useState } from "react";
import LoginForm from "@/app/authenticate/LoginForm";
import RegisterForm from "@/app/authenticate/RegisterForm";
import styles from "./AuthModal.module.css";

export default function AuthModal({ redirectUri }) {
    const [mode, setMode] = useState("login");

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.formWrapper}>
                    {mode === "login" && <LoginForm onSwitch={() => setMode("register")} redirectUri={redirectUri}/>}
                    {mode === "register" && <RegisterForm onSwitch={() => setMode("login")} redirectUri={redirectUri}/> }
                </div>
            </div>
        </div>
    );
}
