import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Token from "@/lib/models/Token";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { mobile } = await request.json();

    if (!mobile) {
      return NextResponse.json(
        { status: "error", error: "Mobile number is required" },
        { status: 400 }
      );
    }

    const mobileRegex = /^[+]?[\d\s\-]{10,}$/;
    if (!mobileRegex.test(mobile.trim())) {
      return NextResponse.json(
        { status: "error", error: "Invalid mobile number format" },
        { status: 400 }
      );
    }

    const normalizedMobile = mobile.trim();
    const token = await Token.findOne({ mobile: normalizedMobile });

    if (token?.isWinner) {
      return NextResponse.json({
        status: "winner",
        mobile: normalizedMobile,
        message: "Congratulations! You are a winner!",
      });
    } else {
      const winners = await Token.find({ isWinner: true }).limit(20);
      const winnerMobiles = winners.map((entry) => entry.mobile);
      return NextResponse.json({
        status: "not-winner",
        mobile: normalizedMobile,
        winners: winnerMobiles,
        message: "Sorry, you didn't win this time. Keep trying!",
      });
    }
  } catch (error) {
    console.error("Error checking participant status:", error);
    return NextResponse.json(
      { status: "error", error: "Internal server error" },
      { status: 500 }
    );
  }
}
