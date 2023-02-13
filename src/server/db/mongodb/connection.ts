import { MongoClient } from 'mongodb';
import mongoose from 'mongoose';
import logger from '@/server/logger';

// Persistent client
let client: MongoClient;

mongoose.set('strictQuery', false);

export const connect = async () => {
  logger.verbose('Connecting database ...');
  if (!process.env.MONGODB_URL) {
    logger.error('No Mongodb URL found!');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      autoIndex: true,
      auth: {
        username: process.env.MONGODB_USER,
        password: process.env.MONGODB_PASSWORD,
      },
    });
    client = mongoose.connection?.getClient();
    logger.verbose('Database connected!');
  } catch (error) {
    logger.error(`Failed to connect to database: ${error}`);
    throw error;
  }
};

export const disconnect = () => {
  logger.verbose('Disconnecting database ...');
  return mongoose.disconnect()
    .then(() => logger.verbose('Database disconnected.'));
};

export const isConnected = () => !!client;
