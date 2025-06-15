import { type NextRequest, NextResponse } from "next/server"

// In-memory storage for demo purposes
// In production, use a proper database
const winners: string[] = []

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json()

    if (!mobile || typeof mobile !== "string") {
      return NextResponse.json({ success: false, error: "Mobile number is required" }, { status: 400 })
    }

    // Validate mobile number format (basic validation)
    const mobileRegex = /^[0-9]{10,15}$/
    if (!mobileRegex.test(mobile.replace(/\s+/g, ""))) {
      return NextResponse.json({ success: false, error: "Invalid mobile number format" }, { status: 400 })
    }

    const cleanMobile = mobile.trim()

    // Check if already exists
    if (winners.includes(cleanMobile)) {
      return NextResponse.json({ success: false, error: "This mobile number is already a winner" }, { status: 409 })
    }

    // Add to winners list
    winners.push(cleanMobile)

    return NextResponse.json({
      success: true,
      message: "Winner added successfully",
      totalWinners: winners.length,
    })
  } catch (error) {
    console.error("Error adding winner:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// Optional: GET endpoint to retrieve all winners (admin only)
export async function GET() {
  return NextResponse.json({
    success: true,
    winners,
    totalWinners: winners.length,
  })
}
