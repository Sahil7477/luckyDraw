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
import { Loader2, Trophy, UserPlus, CheckCircle, AlertCircle } from "lucide-react"

interface ApiResponse {
  success: boolean
  error?: string
  message?: string
}

export default function AdminPage() {
  const [mobile, setMobile] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recentWinners, setRecentWinners] = useState<string[]>([])
  const { toast } = useToast()

  const validateMobile = (mobile: string): boolean => {
    const mobileRegex = /^[+]?[\d\s\-$$$$]{10,}$/
    return mobileRegex.test(mobile.trim())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!mobile.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a mobile number",
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

    try {
      const res = await fetch("/api/admin/add", {
        method: "POST",
        body: JSON.stringify({ mobile: mobile.trim() }),
        headers: { "Content-Type": "application/json" },
      })

      const data: ApiResponse = await res.json()

      if (data.success) {
        toast({
          title: "Success!",
          description: `Winner ${mobile} has been added successfully`,
        })
        setRecentWinners((prev) => [mobile, ...prev.slice(0, 4)])
        setMobile("")
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add winner",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Network Error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
          </div>
          <p className="text-slate-600">Manage contest winners and announcements</p>
        </div>

        {/* Main Form Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-blue-500" />
              Add New Winner
            </CardTitle>
            <CardDescription>Enter the mobile number of the contest winner</CardDescription>
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
                  placeholder="Enter mobile number (e.g., +1234567890)"
                  className="h-11"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                disabled={!mobile.trim() || isLoading}
                className="w-full h-11 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding Winner...
                  </>
                ) : (
                  <>
                    <Trophy className="mr-2 h-4 w-4" />
                    Add Winner
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Winners */}
        {recentWinners.length > 0 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Recent Winners
              </CardTitle>
              <CardDescription>Recently added contest winners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentWinners.map((winner, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-slate-900">{winner}</span>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Winner
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Alert className="border-blue-200 bg-blue-50">
          <AlertCircle className="h-4 w-4 text-blue-500" />
          <AlertDescription className="text-blue-700">
            <strong>Note:</strong> Make sure to verify the mobile number before adding it as a winner. This action will
            notify the winner and update the contest records.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
