"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { updatePassword } from "@/lib/api/userClient";
import { isValidEmail } from "@/components/auth/authUtils";
import "./cards.css";

export function Card({ children }) {
  return <section className="card">{children}</section>;
}

function CardShell({ title, description, children, actions }) {
  return (
    <Card>
      <div className="cardInner">
        <div className="cardHeader">
          <div>
            <h2 className="cardTitle">{title}</h2>
            <p className="cardDesc">{description}</p>
          </div>
        </div>
        <div className="cardBody">{children}</div>
        <div className="cardActions">{actions}</div>
      </div>
    </Card>
  );
}

function CardActions({ isPristine, onCancel, onSave }) {
  return (
    <>
      {!isPristine && (
        <button className="btnGhost" onClick={onCancel}>
          Cancel
        </button>
      )}
      <button className="btnPrimary" onClick={onSave} disabled={isPristine}>
        Save changes
      </button>
    </>
  );
}

export function NameCard({ userName }) {
  const [name, setName] = useState("");
  const isPristine = useMemo(() => name === "", [name]);

  const clearFields = () => setName("");

  return (
    <CardShell
      title="Name"
      description="This will be shown across your account."
      actions={
        <CardActions isPristine={isPristine} onCancel={clearFields} onSave={undefined} />
      }
    >
      <InputBox
        field="Name"
        placeholder={userName}
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
      />
    </CardShell>
  );
}

export function EmailCard({ userEmail }) {
  const [email, setEmail] = useState("");
  const [isPristine, setIsPristine] = useState(true);
  const [emailError, setEmailError] = useState(null);

  useEffect(() => {
    const error = !email ? null : isValidEmail(email) ? null : "Email Address is invalid";
    setEmailError(error);
    setIsPristine(!email || !!error);
  }, [email]);

  const clearFields = () => setEmail("");

  return (
    <CardShell
      title="Email"
      description="Used for sign-in and notifications."
      actions={
        <CardActions isPristine={isPristine} onCancel={clearFields} onSave={undefined} />
      }
    >
      <InputBox
        field="Email"
        placeholder={userEmail}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="text"
      />
      {emailError && <p>{emailError}</p>}
    </CardShell>
  );
}

export function PasswordCard() {
  const [error, setError] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isPristine = useMemo(
    () => !currentPassword && !newPassword && !confirmPassword,
    [currentPassword, newPassword, confirmPassword]
  );

  const clearFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSubmit = async () => {
    setError(null);
    try {
      const res = await updatePassword({ currentPassword, newPassword });
      const data = await res.json();
      if (data?.error) {
        setError(data.error);
        return;
      }
      clearFields();
    } catch (e) {
      console.error("Error updating password", e);
    }
  };

  return (
    <CardShell
      title="Password"
      description="Choose a strong password you don’t reuse elsewhere."
      actions={
        <CardActions isPristine={isPristine} onCancel={clearFields} onSave={handleSubmit} />
      }
    >
      {error && <p>{error}</p>}

      <div className="fieldGrid">
        <InputBox
          field="Current password"
          placeholder="Enter current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          type="password"
        />
        <InputBox
          field="New password"
          placeholder="Create a new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type="password"
        />
        <InputBox
          field="Confirm password"
          placeholder="Re-enter new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type="password"
        />
      </div>
    </CardShell>
  );
}

export function InputBox({ field, placeholder, value, onChange, type }) {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current.focus();
    inputRef.current.readOnly = false;
  };

  return (
    <div onClick={handleClick} className="field">
      <div className="fieldLabel">{field}</div>
      <input
        className="fieldInput"
        placeholder={placeholder}
        ref={inputRef}
        value={value}
        onChange={onChange}
        type={type}
        autoComplete="off"
        readOnly
      />
    </div>
  );
}




