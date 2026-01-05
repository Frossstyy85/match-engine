"use client";

import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import styles from "./AuthModal.module.css";

export default function AuthModal({ onClose } ) {
    const [isLogin, setIsLogin] = useState(true);

    const switchForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.titleWrap}>
                        <h2 className={styles.title}>{isLogin ? "Welcome back" : "Create your account"}</h2>
                        <p className={styles.subtitle}>
                            {isLogin ? "Sign in to continue" : "It takes less than a minute"}
                        </p>
                    </div>
                    <button className={styles.close} onClick={onClose} aria-label="Close">
                        ✕
                    </button>
                </div>
                <div className={styles.body}>
                    {isLogin ? <LoginForm onSwitch={switchForm} /> : <RegisterForm onSwitch={switchForm} />}
                </div>
            </div>
        </div>
    );
}
