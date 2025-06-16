import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Winner from '@/lib/models/Winner';

export async function POST(req: Request) {
  await connectDB();
  const { mobile } = await req.json();
  if (!mobile) return NextResponse.json({ error: 'Mobile required' }, { status: 400 });

  const exists = await Winner.findOne({ mobile });
  if (exists) return NextResponse.json({ error: 'Already added' }, { status: 409 });

  await Winner.create({ mobile });
  return NextResponse.json({ success: true });
}
