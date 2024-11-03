import { Bucket, Transaction, User } from '@/models';
import db from '@/server/db';
import logger from '../logger';
import { createService, ServiceHandlers } from './createService';
import { AuthenticatedQuery } from '../db/AuthenticatedQuery';

const serviceHandlers: ServiceHandlers<Transaction> = {
  get: db.getTransaction,
  getAll: db.getAllTransactions,
  add: db.addTransaction,
  addAll: db.addTransactions,
  update: db.updateTransaction,
  updateAll: db.updateTransactions,
  deleteAll: db.deleteTransactions,
};

const service = createService('transaction', serviceHandlers);

export const transactionService = {
  ...service,
  getAllByBuckets: async (buckets: Bucket[], user: User) => {
    const refIds = buckets.map((ref) => ref.id);
    const query = new AuthenticatedQuery<Transaction>(user).findBy('bucketId', refIds).doesNotHave('mergedTransactionId');
    return db.getAllTransactions(query);
  },
  deleteAllByBucket: async (bucketId: string, user: User) => {
    logger.info(`Deleting all transactions for bucket ${bucketId} ...`);
  
    const query = new AuthenticatedQuery<Transaction>(user).findBy('bucketId', bucketId);
    await db.deleteTransactions(query);
  },
};
