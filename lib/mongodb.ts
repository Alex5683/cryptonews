import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.warn('MONGODB_URI not found in environment variables. Database features will be disabled.');
}

interface CachedMongoose {
  conn: typeof import('mongoose') | null;
  promise: Promise<typeof import('mongoose')> | null;
  models: Record<string, any>;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: CachedMongoose | undefined;
}

let cached = global.mongoose!;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, models: {} };
}

async function connectMongoDB() {
  if (!MONGODB_URI) {
    throw new Error('MongoDB URI not configured');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      // Copy models to cached.models to ensure single mongoose instance models
      cached.models = mongoose.models;
      return mongoose;
    }).catch((error) => {
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectMongoDB;
