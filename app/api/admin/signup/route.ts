import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import Admin from '@/lib/models/Admin';

export async function POST(req: Request) {
  await connectDB();
  const { username, password } = await req.json();
  if (!username || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const exists = await Admin.findOne({ username });
  if (exists) return NextResponse.json({ error: 'Username already exists' }, { status: 409 });

  const hash = await bcrypt.hash(password, 10);
  await Admin.create({ username, passwordHash: hash });
  return NextResponse.json({ success: true }, { status: 201 });
}
