"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Users, ShieldCheckIcon, LogIn, UserPlus } from "lucide-react";

type Winner = { mobile: string; token: string };

export default function Home() {
  const [mode, setMode] = useState<
    "switch" | "admin-login" | "admin-signup" | "admin" | "participant"
  >("switch");
  const [authenticated, setAuthenticated] = useState(false);

  const [login, setLogin] = useState({ username: "", password: "" });
  const [signup, setSignup] = useState({
    username: "",
    password: "",
    accessCode: "",
  });

  const [adminMobile, setAdminMobile] = useState("");
  const [adminToken, setAdminToken] = useState("");
  const [checkMobile, setCheckMobile] = useState("");
  const [winner, setWinner] = useState<Winner | null>(null);
  const [winnerList, setWinnerList] = useState<Winner[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    const res = await fetch("/api/admin/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signup),
    });
    const data = await res.json();
    setMessage(
      data.success
        ? "Registration completed successfully. Please proceed to login."
        : data.error
    );
    if (data.success) setMode("admin-login");
  };

  const handleLogin = async () => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(login),
    });
    const data = await res.json();
    if (data.success) {
      setAuthenticated(true);
      setMode("admin");
      setMessage("");
    } else setMessage(data.error);
  };

  const addWinner = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/add-winner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: adminMobile, token: adminToken }),
    });
    const data = await res.json();
    setMessage(
      data.success
        ? "Winner has been successfully registered in the system."
        : data.error
    );
    if (data.success) {
      setAdminMobile("");
      setAdminToken("");
    }
    setLoading(false);
  };

  const checkStatus = async () => {
    setLoading(true);
    const res = await fetch("/api/participant/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile: checkMobile }),
    });
    const data = await res.json();
    setWinner(
      data.status === "winner"
        ? { mobile: data.mobile, token: data.token }
        : null
    );
    setWinnerList(data.winners || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex items-center justify-center p-4">
      {mode === "switch" && (
        <Card className="max-w-md w-full p-8 space-y-6 text-center shadow-xl bg-white/90">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-indigo-700">
              Kerala State Lottery
            </h1>
            <p className="text-gray-600">Official Draw Results Portal</p>
          </div>

          {/* Participant Main Entry */}
          <Button
            onClick={() => setMode("participant")}
            className="w-full py-3 text-lg"
          >
            Check Your Results
          </Button>

          {/* 🔐 Hidden Admin Access */}
          <p
            className="text-xs text-gray-300 hover:text-indigo-600 cursor-pointer transition-colors"
            onClick={() => setMode("admin-login")}
            title="Administrative Access"
          >
            © 2025 Kerala State Lottery Board | Official Portal
          </p>
        </Card>
      )}

      {mode === "admin-signup" && (
        <Card className="max-w-md w-full p-8 space-y-4 shadow-xl bg-white/90">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <UserPlus className="w-6 h-6" /> Administrator Registration
            </h2>
            <p className="text-gray-600 text-sm">
              Create a new administrative account
            </p>
          </div>
          <Input
            placeholder="Enter username"
            value={signup.username}
            onChange={(e) => setSignup({ ...signup, username: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Create secure password"
            value={signup.password}
            onChange={(e) => setSignup({ ...signup, password: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Administrative access code"
            value={signup.accessCode}
            onChange={(e) =>
              setSignup({ ...signup, accessCode: e.target.value })
            }
          />
          <Button onClick={handleSignup} className="w-full">
            Create Account
          </Button>
          {message && (
            <p className="text-center text-red-600 text-sm">{message}</p>
          )}
          <Button
            variant="link"
            onClick={() => setMode("admin-login")}
            className="w-full"
          >
            Already have an account? Sign In
          </Button>
        </Card>
      )}

      {mode === "admin-login" && (
        <Card className="max-w-md w-full p-8 space-y-4 shadow-xl bg-white/90">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <LogIn className="w-6 h-6" /> Administrator Login
            </h2>
            <p className="text-gray-600 text-sm">
              Access the administrative dashboard
            </p>
          </div>
          <Input
            placeholder="Username"
            value={login.username}
            onChange={(e) => setLogin({ ...login, username: e.target.value })}
          />
          <Input
            type="password"
            placeholder="Password"
            value={login.password}
            onChange={(e) => setLogin({ ...login, password: e.target.value })}
          />
          <Button onClick={handleLogin} className="w-full">
            Sign In
          </Button>
          {message && (
            <p className="text-center text-red-600 text-sm">{message}</p>
          )}
          <Button
            variant="link"
            onClick={() => setMode("admin-signup")}
            className="w-full"
          >
            Need an account? Register Here
          </Button>
        </Card>
      )}

      {mode === "admin" && authenticated && (
        <Card className="max-w-md w-full p-8 space-y-4 shadow-xl bg-white/90">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <ShieldCheckIcon className="w-6 h-6" /> Administrative Dashboard
            </h2>
            <p className="text-gray-600 text-sm">
              Manage lottery winners and results
            </p>
          </div>
          <Input
            placeholder="Winner's mobile number"
            value={adminMobile}
            onChange={(e) => setAdminMobile(e.target.value)}
          />
          <Input
            placeholder="Lottery ticket number"
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
          />
          <Button onClick={addWinner} disabled={loading} className="w-full">
            {loading ? "Processing..." : "Register Winner"}
          </Button>
          {message && (
            <p className="text-center text-green-600 text-sm">{message}</p>
          )}
          <Button
            variant="outline"
            onClick={() => {
              setMode("switch");
              setAuthenticated(false);
            }}
            className="w-full"
          >
            Sign Out
          </Button>
        </Card>
      )}

      {mode === "participant" && (
        <Card className="max-w-md w-full p-8 space-y-4 shadow-xl bg-white/90">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
              <Users className="w-6 h-6" /> Result Verification
            </h2>
            <p className="text-gray-600 text-sm">
              Check your lottery ticket status
            </p>
          </div>
          <Input
            placeholder="Enter your registered mobile number"
            value={checkMobile}
            onChange={(e) => setCheckMobile(e.target.value)}
          />
          <Button onClick={checkStatus} disabled={loading} className="w-full">
            {loading ? "Verifying..." : "Check Results"}
          </Button>

         {winner && (
  <div className="text-center space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
    <div className="text-2xl">🎉</div>
    <p className="text-green-700 font-semibold text-lg">
      Congratulations!
    </p>
    <p className="text-gray-800">
      Mobile: <strong>{winner.mobile}</strong>
      <br />
      Ticket Number: <strong>{winner.token}</strong>
    </p>
    <div className="space-y-2 text-sm">
      <p className="text-green-800 font-medium">
        You have won a prize amount of ₹8,00,000 (Eight Lakh Rupees)
      </p>
      <p className="text-gray-800">
        Our team will reach you after some verification and will
        transfer the prize money into your bank account.
      </p>
      <p className="text-blue-600">
        For more information, visit our official website:{" "}
        <a
          href="https://keralastatelotteryresults.store/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-blue-800"
        >
          keralastatelotteryresults.store
        </a>
      </p>
    </div>
  </div>
)}
          {!winner && winnerList.length > 0 && (
            <div className="text-center space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-700 font-medium">
                Result Status: Not a Winner
              </p>
              <p className="text-gray-600 text-sm">
                Your mobile number was not found in the current draw&apos;s winning
                list. Thank you for participating and better luck in future
                draws.
              </p>
              <p className="text-blue-600 text-sm">
                Visit our official website for upcoming draws:{" "}
                <a
                  href="https://keralastatelotteryresults.store/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-800"
                >
                  keralastatelotteryresults.store
                </a>
              </p>
            </div>
          )}

          <Button
            variant="outline"
            onClick={() => setMode("switch")}
            className="w-full"
          >
            Return to Home
          </Button>
        </Card>
      )}
    </div>
  );
}
