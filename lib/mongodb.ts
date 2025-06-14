import mongoose from 'mongoose';

declare global {
  var mongooseConn: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

let cached = global.mongooseConn || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI!, {
      dbName: 'luckydraw',
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  global.mongooseConn = cached;
  return cached.conn;
}
