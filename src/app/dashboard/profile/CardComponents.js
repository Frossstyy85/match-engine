"use client";

import axios from "axios";
import { useRef, useState } from "react";

export function PasswordCard() {


    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const clearFields = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (newPassword !== confirmPassword){
            setError("password dont match");
            return;
        }
        try {
            await axios.patch("/api/user/password", {currentPassword: currentPassword, newPassword: newPassword});
            setSuccess("password updated");
            clearFields();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    }

    const isPristine =
        currentPassword === "" &&
        newPassword === "" &&
        confirmPassword === "";

    return (
        <div>
            <h2>Reset password</h2>
            <form onSubmit={onSubmit}>
                {error && <p>{error}</p>}
                {success && <p>{success}</p>}
                <div>
                    <InputField
                        label={"CURRENT PASSWORD"}
                        placeholder={"CURRENT PASSWORD"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        type={"password"}
                    />
                    <InputField
                        label={"NEW PASSWORD"}
                        placeholder={"NEW PASSWORD"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        type={"password"}
                    />
                    <InputField
                        label={"CONFIRM NEW PASSWORD"}
                        placeholder={"CONFIRM NEW PASSWORD"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type={"password"}
                    />
                </div>
                {!isPristine && <button onClick={clearFields} type="button">clear</button>}
                <button type="submit">save</button>
            </form>
        </div>
    );
}

function InputField({ label, placeholder, value, onChange, type }) {
    const inputRef = useRef(null);

    const focusInput = () => {
        inputRef.current.focus();
    };

    return (
        <div onClick={focusInput}>
            <span>{label}</span>
            <input
                type={type}
                ref={inputRef}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
