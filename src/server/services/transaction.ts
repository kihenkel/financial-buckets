import { Transaction, User } from '@/models';
import db from '@/server/db';
import { Query } from '../db/Query';
import logger from '../logger';
import { createService, ServiceHandlers } from './createService';

const serviceHandlers: ServiceHandlers<Transaction> = {
  get: db.getTransaction,
  getAll: db.getAllTransactions,
  add: db.addTransaction,
  addAll: db.addTransactions,
  update: db.updateTransaction,
  updateAll: db.updateTransactions,
  deleteAll: db.deleteTransactions,
};

export const transactionService = {
  ...createService('transaction', serviceHandlers),
  deleteAllByBucket: async(bucketId: string, user: User) => {
    logger.info(`Deleting all transactions for bucket ${bucketId} ...`);
  
    const query = new Query<Transaction>().findBy('bucketId', bucketId).findBy('userId', user.id);
    await db.deleteTransactions(query);
  }
};
