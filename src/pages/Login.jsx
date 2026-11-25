import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

export default function Login() {
  const { login, signup, toast } = useApp();
  const nav = useNavigate();
  const from = useLocation().state?.from || "/";
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const submit = (e) => {
    e.preventDefault();
    if (mode === "signup" && f.name.trim().length < 2) return setError("Enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setError("Enter a valid email address.");
    if (f.password.length < 6) return setError("Password must be at least 6 characters.");
    const res = mode === "login" ? login(f.email, f.password) : signup(f.name, f.email, f.password);
    if (!res.ok) return setError(res.error);
    toast(mode === "login" ? "Welcome back!" : "Account created");
    nav(from, { replace: true });
  };

  return (
    <form className="form auth" onSubmit={submit} noValidate>
      <div className="chips">
        <button type="button" className={mode === "login" ? "chip on" : "chip"} onClick={() => { setMode("login"); setError(""); }}>Log in</button>
        <button type="button" className={mode === "signup" ? "chip on" : "chip"} onClick={() => { setMode("signup"); setError(""); }}>Sign up</button>
      </div>
      <h1>{mode === "login" ? "Log in to Altuzz Zone" : "Create your account"}</h1>
      {mode === "signup" && <label>Name<input value={f.name} onChange={set("name")} autoComplete="name" /></label>}
      <label>Email<input type="email" value={f.email} onChange={set("email")} autoComplete="email" /></label>
      <label>Password<input type="password" value={f.password} onChange={set("password")} autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
      {error && <p className="err" role="alert">{error}</p>}
      <button className="btn wide">{mode === "login" ? "Log in" : "Create account"}</button>
      <p className="muted">Admin demo: admin@altuzz.com / admin123</p>
    </form>
  );
}
