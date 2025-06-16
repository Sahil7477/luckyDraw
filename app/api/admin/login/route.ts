import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';

export async function POST(req: Request) {
  await connectDB();
  const { username, password } = await req.json();
  const admin = await Admin.findOne({ username });
  if (!admin) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  const isValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isValid) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

  return NextResponse.json({ success: true });
}
