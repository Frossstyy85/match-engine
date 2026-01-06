"use client";


import {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import axios from "axios";



export default function RegisterForm({ onSwitch } ) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [clear, setClear] = useState(false);

    useEffect(() => {
        const hasInput = !!(name || email || password);
        setClear(hasInput);
        setDisabled(!name || !email || !password);
    }, [name, email, password]);


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

        router.push("/dashboard");

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
              <div>
                  <div>
                      <span>Email</span>
                      <input
                          value={email}
                          onChange={(e) => {
                              setError(null);
                              setEmail(e.target.value);
                          }}
                          placeholder="name@company.com"
                          type="text"
                          autoComplete="email"
                      />
                  </div>
                  <div>
                      <span>Name</span>
                      <input
                          value={name}
                          onChange={(e) => {
                              setError(null);
                              setName(e.target.value);
                          }}
                          placeholder="Your name"
                          type="text"
                          autoComplete="name"
                      />
                  </div>
                  <div>
                      <span>Password</span>
                      <input
                          value={password}
                          onChange={(e) => {
                              setError(null);
                              setPassword(e.target.value);
                          }}
                          placeholder="Create a password"
                          type="password"
                          autoComplete="new-password"
                      />
                  </div>
              </div>
          <div>
              {clear && <button type={"button"} onClick={clearFields}>clear</button>}
              <button type={"submit"} disabled={disabled}>
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

