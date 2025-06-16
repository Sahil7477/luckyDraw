import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb'; 
import Token from '@/lib/models/Token';

export async function POST(req: Request) {
  try {
    await connectDB();

    const { mobile } = await req.json();

    if (!mobile) {
      return NextResponse.json({ error: 'Mobile number is required' }, { status: 400 });
    }

    const existing = await Token.findOne({ mobile });

    if (existing) {
      return NextResponse.json({ error: 'Mobile already registered' }, { status: 409 });
    }

    const newToken = await Token.create({ mobile });
    return NextResponse.json({ success: true, token: newToken }, { status: 201 });
  } catch (error) {
    console.error('POST /api/token error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
