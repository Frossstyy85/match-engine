import {useRef} from "react";
import styles from "./InputField.module.css"

export default function InputField({label, placeholder, value, onChange, type}) {
    const inputRef = useRef(null);

    const focusInput = () => {
        inputRef.current.focus();
    };

    return (
        <div
            onClick={focusInput}
            className={styles.field}
        >
            <small>{label}</small>
            <input
                type={type}
                ref={inputRef}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                autoComplete={"off"}
            />
        </div>
    );
}