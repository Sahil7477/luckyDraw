import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Winner from "@/lib/models/Winner";

export async function POST(req: NextRequest) {
  await connectDB();
  const { mobile } = await req.json();

  if (!mobile) {
    return NextResponse.json({ error: "Mobile number is required" }, { status: 400 });
  }

  // Check if the mobile number is a winner
  const winner = await Winner.findOne({ mobile }).lean() as { mobile: string; token: string } | null;

  if (winner) {
    return NextResponse.json({
      status: "winner",
      mobile: winner.mobile,
      token: winner.token,
    });
  }

  // Otherwise, return the list of winner entries (but no token)
  const winners = await Winner.find().select("mobile token -_id").lean();
  return NextResponse.json({
    status: "not-winner",
    winners: winners.map((w) => ({ mobile: w.mobile, token: w.token })),
  });
}
