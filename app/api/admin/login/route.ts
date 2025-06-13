import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Admin } from '@/lib/models/Admin';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = signToken({ email });

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 60 * 60,
    path: '/',
  });

  return response;
}
