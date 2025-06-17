import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI environment variable is not defined');
}

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'luckydraw',
    });

    isConnected = true;
    console.log('✅ Mongoose connected to MongoDB!');
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Mongoose connection error:', error.message);
    } else {
      console.error('❌ Unknown connection error:', error);
    }
    throw new Error('Failed to connect to MongoDB');
  }
}
