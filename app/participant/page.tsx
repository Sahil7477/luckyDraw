"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Loader2, Trophy, X, Phone } from "lucide-react"

interface CheckStatusResponse {
  status: "winner" | "not-winner"
  winners?: string[]
  message?: string
}

type StatusState = "idle" | "loading" | "winner" | "not-winner" | "error"

export default function ParticipantPage() {
  const [mobile, setMobile] = useState("")
  const [status, setStatus] = useState<StatusState>("idle")
  const [winners, setWinners] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^[0-9]{10,15}$/
    return mobileRegex.test(mobile.replace(/\s+/g, ""))
  }

  const checkStatus = async () => {
    if (!mobile.trim()) {
      setError("Please enter your mobile number")
      return
    }

    if (!validateMobile(mobile)) {
      setError("Please enter a valid mobile number")
      return
    }

    setStatus("loading")
    setError(null)

    try {
      const res = await fetch("/api/participant/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobile.trim() }),
      })

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }

      const data: CheckStatusResponse = await res.json()

      if (data.status === "winner") {
        setStatus("winner")
      } else {
        setStatus("not-winner")
        setWinners(data.winners || [])
      }
    } catch (err) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    }
  }

  const resetForm = () => {
    setStatus("idle")
    setMobile("")
    setWinners([])
    setError(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      checkStatus()
    }
  }

  const isLoading = status === "loading"

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Lucky Draw Results
          </CardTitle>
          <CardDescription>Enter your mobile number to check if you're a winner</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
                disabled={isLoading}
                type="tel"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <X className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <Button onClick={checkStatus} disabled={isLoading || !mobile.trim()} className="w-full" size="lg">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "Check Result"
            )}
          </Button>

          {status === "winner" && (
            <Alert className="border-green-200 bg-green-50">
              <Trophy className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 font-semibold">
                🎉 Congratulations! You are a winner!
              </AlertDescription>
            </Alert>
          )}

          {status === "not-winner" && (
            <div className="space-y-4">
              <Alert variant="destructive">
                <X className="h-4 w-4" />
                <AlertDescription>Sorry, you did not win this time. Better luck next time!</AlertDescription>
              </Alert>

              {winners.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-gray-700">Winning Numbers:</h3>
                  <div className="flex flex-wrap gap-2">
                    {winners.map((num, index) => (
                      <Badge
                        key={`${num}-${index}`}
                        variant="secondary"
                        className="bg-green-100 text-green-800 hover:bg-green-200"
                      >
                        {num}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {(status === "winner" || status === "not-winner" || status === "error") && (
            <Button onClick={resetForm} variant="outline" className="w-full">
              Check Another Number
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
