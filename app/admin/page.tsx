"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Loader2,
  Shield,
  Plus,
  Trash2,
  Users,
  Phone,
  CheckCircle,
  AlertCircle,
  Download,
  RefreshCw,
} from "lucide-react"

interface Winner {
  id: string
  mobile: string
  addedAt: string
}

interface AdminStats {
  totalWinners: number
  totalChecks: number
  lastUpdated: string
}

interface ApiResponse {
  success: boolean
  message?: string
  error?: string
  data?: any
}

type ActionState = "idle" | "loading" | "success" | "error"

export default function AdminPage() {
  const [mobile, setMobile] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null)
  const [actionState, setActionState] = useState<ActionState>("idle")
  const [winners, setWinners] = useState<Winner[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loadingWinners, setLoadingWinners] = useState(false)

  useEffect(() => {
    fetchWinners()
    fetchStats()
  }, [])

  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^[0-9]{10,15}$/
    return mobileRegex.test(mobile.replace(/\s+/g, ""))
  }

  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => {
      setMessage("")
      setMessageType(null)
    }, 5000)
  }

  const fetchWinners = async () => {
    setLoadingWinners(true)
    try {
      const res = await fetch("/api/admin/winners")
      const data: ApiResponse = await res.json()

      if (res.ok && data.success) {
        setWinners(data.data || [])
      } else {
        showMessage(data.error || "Failed to fetch winners", "error")
      }
    } catch (error) {
      showMessage("Failed to fetch winners", "error")
    } finally {
      setLoadingWinners(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats")
      const data: ApiResponse = await res.json()

      if (res.ok && data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  const addWinner = async () => {
    if (!mobile.trim()) {
      showMessage("Please enter a mobile number", "error")
      return
    }

    if (!validateMobile(mobile)) {
      showMessage("Please enter a valid mobile number", "error")
      return
    }

    // Check if winner already exists
    if (winners.some((winner) => winner.mobile === mobile.trim())) {
      showMessage("This mobile number is already a winner", "error")
      return
    }

    setActionState("loading")

    try {
      const res = await fetch("/api/admin/add-winner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobile.trim() }),
      })

      const data: ApiResponse = await res.json()

      if (res.ok && data.success) {
        setActionState("success")
        showMessage("Winner added successfully!", "success")
        setMobile("")
        fetchWinners()
        fetchStats()
      } else {
        setActionState("error")
        showMessage(data.error || "Failed to add winner", "error")
      }
    } catch (error) {
      setActionState("error")
      showMessage("Network error. Please try again.", "error")
    } finally {
      setTimeout(() => setActionState("idle"), 2000)
    }
  }

  const removeWinner = async (winnerId: string, winnerMobile: string) => {
    if (!confirm(`Are you sure you want to remove ${winnerMobile} from winners?`)) {
      return
    }

    try {
      const res = await fetch("/api/admin/remove-winner", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winnerId }),
      })

      const data: ApiResponse = await res.json()

      if (res.ok && data.success) {
        showMessage("Winner removed successfully!", "success")
        fetchWinners()
        fetchStats()
      } else {
        showMessage(data.error || "Failed to remove winner", "error")
      }
    } catch (error) {
      showMessage("Failed to remove winner", "error")
    }
  }

  const clearAllWinners = async () => {
    if (!confirm("Are you sure you want to clear ALL winners? This action cannot be undone.")) {
      return
    }

    try {
      const res = await fetch("/api/admin/clear-winners", {
        method: "DELETE",
      })

      const data: ApiResponse = await res.json()

      if (res.ok && data.success) {
        showMessage("All winners cleared successfully!", "success")
        fetchWinners()
        fetchStats()
      } else {
        showMessage(data.error || "Failed to clear winners", "error")
      }
    } catch (error) {
      showMessage("Failed to clear winners", "error")
    }
  }

  const exportWinners = () => {
    if (winners.length === 0) {
      showMessage("No winners to export", "error")
      return
    }

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Mobile Number,Added Date\n" +
      winners.map((winner) => `${winner.mobile},${new Date(winner.addedAt).toLocaleString()}`).join("\n")

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `winners_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showMessage("Winners list exported successfully!", "success")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && actionState !== "loading") {
      addWinner()
    }
  }

  const isLoading = actionState === "loading"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-slate-600 to-gray-700 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-slate-700 to-gray-800 bg-clip-text text-transparent">
              Admin Panel
            </CardTitle>
            <CardDescription>Manage lucky draw winners and view statistics</CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{stats.totalWinners}</div>
                <div className="text-sm text-gray-600">Total Winners</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold">{stats.totalChecks}</div>
                <div className="text-sm text-gray-600">Total Checks</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-sm font-medium">Last Updated</div>
                <div className="text-xs text-gray-600">{new Date(stats.lastUpdated).toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Add Winner Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Winner
            </CardTitle>
            <CardDescription>Enter a mobile number to add to the winners list</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Enter winner mobile number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                  disabled={isLoading}
                  type="tel"
                />
              </div>
              <Button onClick={addWinner} disabled={isLoading || !mobile.trim()} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Winner
                  </>
                )}
              </Button>
            </div>

            {message && (
              <Alert
                variant={messageType === "error" ? "destructive" : "default"}
                className={messageType === "success" ? "border-green-200 bg-green-50" : ""}
              >
                {messageType === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription className={messageType === "success" ? "text-green-800" : ""}>
                  {message}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Winners List */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Winners List ({winners.length})
                </CardTitle>
                <CardDescription>Manage current winners</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={exportWinners} variant="outline" size="sm" disabled={winners.length === 0}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button onClick={fetchWinners} variant="outline" size="sm" disabled={loadingWinners}>
                  {loadingWinners ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                </Button>
                <Button onClick={clearAllWinners} variant="destructive" size="sm" disabled={winners.length === 0}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loadingWinners ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                Loading winners...
              </div>
            ) : winners.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No winners added yet</p>
                <p className="text-sm">Add your first winner using the form above</p>
              </div>
            ) : (
              <div className="space-y-3">
                {winners.map((winner, index) => (
                  <div key={winner.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        #{index + 1}
                      </Badge>
                      <div>
                        <div className="font-medium">{winner.mobile}</div>
                        <div className="text-sm text-gray-500">Added: {new Date(winner.addedAt).toLocaleString()}</div>
                      </div>
                    </div>
                    <Button
                      onClick={() => removeWinner(winner.id, winner.mobile)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
