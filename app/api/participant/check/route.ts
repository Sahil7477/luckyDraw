import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
// This should match the storage used in the admin route
// In production, use a proper database
const winners: string[] = []

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json()

    if (!mobile || typeof mobile !== "string") {
      return NextResponse.json({ success: false, error: "Mobile number is required" }, { status: 400 })
    }

    const cleanMobile = mobile.trim()

    // Check if the mobile number is in the winners list
    const isWinner = winners.includes(cleanMobile)

    if (isWinner) {
      return NextResponse.json({
        success: true,
        status: "winner",
        mobile: cleanMobile,
        message: "Congratulations! You are a winner!",
      })
    } else {
      return NextResponse.json({
        success: true,
        status: "not-winner",
        winners: winners, // Return list of winners for display
        message: "Sorry, you are not a winner this time.",
      })
    }
  } catch (error) {
    console.error("Error checking participant status:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
