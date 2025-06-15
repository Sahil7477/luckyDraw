"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Trophy, Users, ShieldCheck, ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react"

// Types
interface Winner {
  mobile: string
}

interface LoginCredentials {
  username: string
  password: string
}

interface ApiResponse {
  success?: boolean
  error?: string
  status?: string
  mobile?: string
  winners?: string[]
}

type AppMode = "switch" | "admin-login" | "admin" | "participant"

// Constants
const ADMIN_USERNAME = "admin"
const ADMIN_PASSWORD = "password123"

export default function LotterySystem() {
  const [mode, setMode] = useState<AppMode>("switch")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Form states
  const [login, setLogin] = useState<LoginCredentials>({ username: "", password: "" })
  const [adminMobile, setAdminMobile] = useState("")
  const [checkMobile, setCheckMobile] = useState("")
  const [winner, setWinner] = useState<Winner | null>(null)
  const [winnerList, setWinnerList] = useState<string[]>([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // Handle admin login
  const handleLogin = () => {
    if (login.username === ADMIN_USERNAME && login.password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setMode("admin")
      setMessage("")
    } else {
      setMessage("Invalid credentials")
    }
  }

  // Add winner (admin)
  const addWinner = async () => {
    if (!adminMobile.trim()) {
      setMessage("Please enter a mobile number")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/admin/add-winner", {
        method: "POST",
        body: JSON.stringify({ mobile: adminMobile }),
        headers: { "Content-Type": "application/json" },
      })

      const data: ApiResponse = await res.json()

      if (data.success) {
        setMessage("Winner added successfully!")
        setAdminMobile("")
      } else {
        setMessage(data.error || "Failed to add winner")
      }
    } catch (error) {
      setMessage("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  // Participant check
  const checkStatus = async () => {
    if (!checkMobile.trim()) {
      setMessage("Please enter your mobile number")
      return
    }

    setLoading(true)
    setMessage("")
    setWinner(null)
    setWinnerList([])

    try {
      const res = await fetch("/api/participant/check", {
        method: "POST",
        body: JSON.stringify({ mobile: checkMobile }),
        headers: { "Content-Type": "application/json" },
      })

      const data: ApiResponse = await res.json()

      if (data.status === "winner") {
        setWinner({ mobile: data.mobile || checkMobile })
      } else {
        setWinnerList(data.winners || [])
      }
    } catch (error) {
      setMessage("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const resetToSwitch = () => {
    setMode("switch")
    setMessage("")
    setWinner(null)
    setWinnerList([])
    setLogin({ username: "", password: "" })
    setAdminMobile("")
    setCheckMobile("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Mode Selection */}
        {mode === "switch" && (
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Lottery System
              </CardTitle>
              <CardDescription>Choose your access level to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setMode("participant")} className="w-full h-12 text-lg" variant="default">
                <Users className="mr-2 h-5 w-5" />
                Participant Access
              </Button>
              <Button onClick={() => setMode("admin-login")} className="w-full h-12 text-lg" variant="outline">
                <ShieldCheck className="mr-2 h-5 w-5" />
                Admin Access
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Admin Login */}
        {mode === "admin-login" && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6" />
                Admin Login
              </CardTitle>
              <CardDescription>Enter your credentials to access admin panel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
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
                  onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>

              {message && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button onClick={handleLogin} className="flex-1">
                  Login
                </Button>
                <Button variant="outline" onClick={resetToSwitch}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Admin Panel */}
        {mode === "admin" && isAuthenticated && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-6 w-6" />
                Admin Panel
              </CardTitle>
              <CardDescription>Add winners to the lottery system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Winner's mobile number"
                  value={adminMobile}
                  onChange={(e) => setAdminMobile(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addWinner()}
                />
                <Button onClick={addWinner} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Winner"}
                </Button>
              </div>

              {message && (
                <Alert variant={message.includes("success") ? "default" : "destructive"}>
                  {message.includes("success") ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <Separator />

              <Button variant="outline" onClick={resetToSwitch} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Main Menu
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Participant Panel */}
        {mode === "participant" && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                Check Your Status
              </CardTitle>
              <CardDescription>Enter your mobile number to see if you're a winner</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Your mobile number"
                  value={checkMobile}
                  onChange={(e) => setCheckMobile(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && checkStatus()}
                />
                <Button onClick={checkStatus} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Check Status"}
                </Button>
              </div>

              {message && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              {/* Winner Result */}
              {winner && (
                <Alert className="border-green-200 bg-green-50">
                  <Trophy className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    🎉 Congratulations! <strong>{winner.mobile}</strong> - You're a WINNER!
                  </AlertDescription>
                </Alert>
              )}

              {/* Non-winner Result */}
              {!winner && winnerList.length > 0 && (
                <div className="space-y-3">
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>Sorry, you didn't win this time. Better luck next time! 🙁</AlertDescription>
                  </Alert>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Trophy className="h-4 w-4" />
                      Current Winners:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {winnerList.map((mobile, index) => (
                        <Badge key={index} variant="secondary">
                          {mobile}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              <Button variant="outline" onClick={resetToSwitch} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Main Menu
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
