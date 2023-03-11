import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import logger from '@/server/logger';

// Persistent client
let client: MongoClient;
let connectPromise: Promise<any> | null;

mongoose.set('strictQuery', false);

export const connect = async () => {
  if (connectPromise) {
    logger.verbose('Already connecting, waiting for connection to resolve ...');
    return connectPromise;
  }
  if (client) {
    logger.verbose('Tried connecting database, but already connected!');
    return;
  }
  logger.verbose('Connecting database ...');
  if (!process.env.MONGODB_URL) {
    logger.error('No Mongodb URL found!');
    return;
  }

  try {
    connectPromise = mongoose.connect(process.env.MONGODB_URL, {
      autoIndex: true,
      auth: {
        username: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASSWORD,
      },
    });
    await connectPromise;
    client = mongoose.connection?.getClient();
    logger.verbose('Database connected!');
    connectPromise = null;
  } catch (error) {
    logger.error(`Failed to connect to database: ${error}`);
    connectPromise = null;
    throw error;
  }
};

export const disconnect = () => {
  logger.verbose('Disconnecting database ...');
  return mongoose.disconnect()
    .then(() => logger.verbose('Database disconnected.'));
};

export const isConnected = () => !!client;
