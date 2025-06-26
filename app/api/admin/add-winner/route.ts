import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Winner from "@/lib/models/Winner";

export async function POST(req: Request): Promise<Response> {
  try {
    await connectDB();
    const body = await req.json();

    // Type-safe extraction
    const { mobile, token }: { mobile: string; token: string } = body;

    if (!mobile || !token) {
      return NextResponse.json({ error: "Missing mobile or token." }, { status: 400 });
    }

    // Check if already exists
    const exists = await Winner.findOne({ mobile });
    if (exists) {
      return NextResponse.json({ error: "Winner already registered." }, { status: 400 });
    }

    const newWinner = new Winner({ mobile, token });
    await newWinner.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Add winner error:", error);
    return NextResponse.json({ error: "Failed to add winner. Try again." }, { status: 500 });
  }
}
