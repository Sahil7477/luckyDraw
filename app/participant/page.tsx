"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Search, Trophy, PartyPopper, Frown, Phone, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react"

interface ApiResponse {
  status: "winner" | "not-winner" | "error"
  mobile?: string
  winners?: string[]
  error?: string
  message?: string
}

export default function ParticipantPage() {
  const [mobile, setMobile] = useState("")
  const [result, setResult] = useState<ApiResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^[+]?[\d\s\-$$$$]{10,}$/
    return mobileRegex.test(mobile.trim())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!mobile.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter your mobile number",
        variant: "destructive",
      })
      return
    }

    if (!validateMobile(mobile)) {
      toast({
        title: "Invalid Mobile Number",
        description: "Please enter a valid mobile number",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const res = await fetch("/api/participant/check", {
        method: "POST",
        body: JSON.stringify({ mobile: mobile.trim() }),
        headers: { "Content-Type": "application/json" },
      })

      const data: ApiResponse = await res.json()
      setResult(data)

      if (data.status === "winner") {
        toast({
          title: "🎉 Congratulations!",
          description: "You're a winner! Check your results below.",
        })
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to check status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderResult = () => {
    if (!result) return null

    if (result.error) {
      return (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertDescription className="text-red-700">
            <strong>Error:</strong> {result.error}
          </AlertDescription>
        </Alert>
      )
    }

    if (result.status === "winner") {
      return (
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <PartyPopper className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl text-green-800 flex items-center justify-center gap-2">
                <Sparkles className="h-6 w-6" />
                Congratulations!
                <Sparkles className="h-6 w-6" />
              </CardTitle>
              <CardDescription className="text-green-700 text-lg">You're a winner in our contest!</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="p-4 bg-white/60 rounded-lg border border-green-200">
              <div className="flex items-center justify-center gap-2 text-green-800">
                <Phone className="h-5 w-5" />
                <span className="font-bold text-lg">{result.mobile}</span>
              </div>
              <Badge className="mt-2 bg-green-600 hover:bg-green-700">
                <Trophy className="h-3 w-3 mr-1" />
                Winner
              </Badge>
            </div>
            <p className="text-green-700">🎉 You will be contacted soon with details about claiming your prize!</p>
          </CardContent>
        </Card>
      )
    }

    if (result.status === "not-winner") {
      return (
        <div className="space-y-6">
          <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <Frown className="h-8 w-8 text-orange-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-orange-800">Not This Time</CardTitle>
                <CardDescription className="text-orange-700">Your number wasn't selected in this draw</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="p-4 bg-white/60 rounded-lg border border-orange-200">
                <div className="flex items-center justify-center gap-2 text-orange-800">
                  <Phone className="h-5 w-5" />
                  <span className="font-medium">{mobile}</span>
                </div>
              </div>
              <p className="mt-4 text-orange-700">
                Don't worry! Keep participating in future contests for more chances to win.
              </p>
            </CardContent>
          </Card>

          {result.winners && result.winners.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Winning Numbers
                </CardTitle>
                <CardDescription>Here are the lucky numbers that won in this contest</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {result.winners.map((winner, index) => (
                    <div
                      key={winner}
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-yellow-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium text-slate-900">{winner}</span>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Winner
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Search className="h-8 w-8 text-blue-500" />
            <h1 className="text-3xl font-bold text-slate-900">Check Your Status</h1>
          </div>
          <p className="text-slate-600">Enter your mobile number to see if you're a winner!</p>
        </div>

        {/* Search Form */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-blue-500" />
              Winner Lookup
            </CardTitle>
            <CardDescription>Enter the mobile number you used to participate in the contest</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-sm font-medium">
                  Mobile Number
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter your mobile number"
                  className="h-11"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                disabled={!mobile.trim() || isLoading}
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking Status...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Check Status
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {renderResult()}

        {/* Info */}
        <Alert className="border-blue-200 bg-blue-50">
          <CheckCircle2 className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700">
            <strong>How it works:</strong> Enter your mobile number to instantly check if you're one of our contest
            winners. Results are updated in real-time.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
