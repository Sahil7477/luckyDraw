import mongoose, { Connection } from 'mongoose';

// Define a proper type for the cached connection
type CachedConnection = {
  conn: Connection | null;
  promise: Promise<Connection> | null;
};

// Use global type augmentation to avoid `any`
declare global {
  // eslint-disable-next-line no-var
  var mongooseConn: CachedConnection | undefined;
}

const cached: CachedConnection = global.mongooseConn ?? {
  conn: null,
  promise: null,
};

export async function connectDB(): Promise<Connection> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI!, {
      dbName: 'luckydraw',
    }).then(mongooseInstance => mongooseInstance.connection);
  }

  cached.conn = await cached.promise;
  global.mongooseConn = cached;

  return cached.conn;
}
