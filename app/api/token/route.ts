import { connectDB } from '@/lib/mongodb';
import { Token } from '@/lib/models/Token';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { name, email } = await req.json();
  await connectDB();

  try {
    const token = await Token.create({ name, email });
    return NextResponse.json(token);
  } catch  {
    
  }
}
