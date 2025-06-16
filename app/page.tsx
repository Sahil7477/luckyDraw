"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import { Users, ShieldCheckIcon, LogIn, UserPlus } from "lucide-react";

type Winner = { mobile: string };

export default function Home() {
  const [mode, setMode] = useState<"switch" | "admin-login" | "admin-signup" | "admin" | "participant">("switch");
  const [authenticated, setAuthenticated] = useState(false);

  const [login, setLogin] = useState({ username: "", password: "" });
  const [signup, setSignup] = useState({ username: "", password: "" });
  const [adminMobile, setAdminMobile] = useState("");
  const [checkMobile, setCheckMobile] = useState("");
  const [winner, setWinner] = useState<Winner | null>(null);
  const [winnerList, setWinnerList] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    const res = await fetch("/api/admin/signup", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(signup)
    });
    const data = await res.json();
    setMessage(data.success ? "Signup successful! Please log in." : data.error);
    if (data.success) setMode("admin-login");
  };

  const handleLogin = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(login)
    });
    const data = await res.json();
    if (data.success) { setAuthenticated(true); setMode("admin"); setMessage(""); }
    else setMessage(data.error);
  };

  const addWinner = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/add-winner", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobile: adminMobile })
    });
    const data = await res.json();
    setMessage(data.success ? "Winner added!" : data.error);
    if (data.success) setAdminMobile("");
    setLoading(false);
  };

  const checkStatus = async () => {
    setLoading(true);
    const res = await fetch("/api/participant/check", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mobile: checkMobile })
    });
    const data = await res.json();
    setWinner(data.status === "winner" ? { mobile: data.mobile } : null);
    setWinnerList(data.winners || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center p-4">
      {mode === "switch" && (
        <Card className="max-w-md w-full p-8 space-y-6 text-center shadow-xl bg-white/90">
          <h1 className="text-3xl font-bold text-indigo-700">Lucky Draw</h1>
          <Button onClick={() => setMode("admin-login")} className="w-full">Admin</Button>
          <Button onClick={() => setMode("participant")} className="w-full">Participant</Button>
        </Card>
      )}

      {mode === "admin-signup" && (
        <Card className="max-w-md w-full p-8 space-y-4 shadow-xl bg-white/90">
          <h2 className="text-2xl font-bold"><UserPlus /> Admin Signup</h2>
          <Input placeholder="Username" value={signup.username} onChange={e => setSignup({ ...signup, username: e.target.value })} />
          <Input type="password" placeholder="Password" value={signup.password} onChange={e => setSignup({ ...signup, password: e.target.value })} />
          <Button onClick={handleSignup}>Signup</Button>
          {message && <p className="text-center text-red-600">{message}</p>}
          <Button variant="link" onClick={() => setMode("admin-login")}>← Login</Button>
        </Card>
      )}

      {mode === "admin-login" && (
        <Card className="max-w-md w-full p-8 space-y-4 shadow-xl bg-white/90">
          <h2 className="text-2xl font-bold"><LogIn /> Admin Login</h2>
          <Input placeholder="Username" value={login.username} onChange={e => setLogin({ ...login, username: e.target.value })} />
          <Input type="password" placeholder="Password" value={login.password} onChange={e => setLogin({ ...login, password: e.target.value })} />
          <Button onClick={handleLogin}>Login</Button>
          {message && <p className="text-center text-red-600">{message}</p>}
          <Button variant="link" onClick={() => setMode("admin-signup")}>← Signup</Button>
        </Card>
      )}

      {mode === "admin" && authenticated && (
        <Card className="max-w-md w-full p-8 space-y-4 shadow-xl bg-white/90">
          <h2 className="text-2xl font-bold flex items-center gap-2"><ShieldCheckIcon /> Admin Panel</h2>
          <Input placeholder="Winner mobile" value={adminMobile} onChange={e => setAdminMobile(e.target.value)} />
          <Button onClick={addWinner} disabled={loading}>{loading ? "Adding..." : "Add Winner"}</Button>
          {message && <p className="text-center text-green-600">{message}</p>}
          <Button variant="link" onClick={() => { setMode("switch"); setAuthenticated(false); }}>← Logout</Button>
        </Card>
      )}

      {mode === "participant" && (
        <Card className="max-w-md w-full p-8 space-y-4 shadow-xl bg-white/90">
          <h2 className="text-2xl font-bold flex items-center gap-2"><Users /> Participant Portal</h2>
          <Input placeholder="Your mobile number" value={checkMobile} onChange={e => setCheckMobile(e.target.value)} />
          <Button onClick={checkStatus} disabled={loading}>{loading ? "Checking..." : "Check Status"}</Button>
          {winner && <p className="text-center text-green-600">🎉 {winner.mobile} — You’re a WINNER!</p>}
          {!winner && winnerList.length > 0 && (
            <div className="text-center">
              <p className="text-red-600 font-semibold">Sorry, not a winner 🙁</p>
              <p className="mt-2 font-medium">Winners list:</p>
              <ul className="mt-2 space-y-1">{winnerList.map(m => <li key={m}>{m}</li>)}</ul>
            </div>
          )}
          <Button variant="link" onClick={() => setMode("switch")}>← Home</Button>
        </Card>
      )}
    </div>
  );
}
