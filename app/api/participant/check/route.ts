import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Winner from '@/lib/models/Winner';

export async function POST(req: Request) {
  await connectDB();
  const { mobile } = await req.json();
  if (!mobile) return NextResponse.json({ error: 'Mobile required' }, { status: 400 });

  const isWinner = await Winner.findOne({ mobile });
  if (isWinner) return NextResponse.json({ status: 'winner', mobile });

  const list = await Winner.find().select('mobile -_id').sort({ createdAt: -1 });
  return NextResponse.json({ status: 'not-winner', winners: list.map(w => w.mobile) });
}
