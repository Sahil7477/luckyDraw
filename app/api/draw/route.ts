import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Token from '@/lib/models/Token';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  await connectDB();

  const token = req.cookies.get('admin_token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    verifyToken(token);
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
  }

  const tokens = await Token.find({ isWinner: false });
  if (tokens.length === 0) {
    return NextResponse.json({ message: 'No tokens left' }, { status: 404 });
  }

  const winner = tokens[Math.floor(Math.random() * tokens.length)];
  await Token.updateOne({ _id: winner._id }, { isWinner: true });

  return NextResponse.json(winner);
}
