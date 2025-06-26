import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import Admin from "@/lib/models/Admin";

export async function POST(req: NextRequest) {
  await connectDB();
  const { username, password, accessCode } = await req.json();

  if (!username || !password || !accessCode) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  if (accessCode !== process.env.ADMIN_ACCESS_CODE) {
    return NextResponse.json({ error: "Invalid access code" }, { status: 403 });
  }

  const existing = await Admin.findOne({ username });
  if (existing) {
    return NextResponse.json({ error: "Admin already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({ username, passwordHash });

  return NextResponse.json({ success: true });
}
