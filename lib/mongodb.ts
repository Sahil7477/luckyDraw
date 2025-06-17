import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('❌ MONGODB_URI environment variable is not defined');
}

// To prevent multiple connections in development (hot reloads)
let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: 'luckydraw',
    });

    isConnected = true;
    console.log('✅ Mongoose connected to MongoDB!');
  } catch (error: any) {
    console.error('❌ Mongoose connection error:', error?.message || error);
    throw new Error('Failed to connect to MongoDB');
  }
}
