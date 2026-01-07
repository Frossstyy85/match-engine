"use client";

import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import styles from "./AuthModal.module.css";

export default function AuthModal({ onClose }) {
    const [isLogin, setIsLogin] = useState(true);

    const switchForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className={styles.overlay}>
            <div>
                <div>
                    <button onClick={onClose}>
                        ✕
                    </button>
                </div>
                <div>
                    {isLogin ? <LoginForm onSwitch={switchForm} /> : <RegisterForm onSwitch={switchForm} />}
                </div>
            </div>
        </div>
    );
}
