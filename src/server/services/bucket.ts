import { Bucket, Transaction, User } from '@/models';
import db from '@/server/db';
import { createService, ServiceHandlers } from './createService';
import { transactionService } from './transaction';

const OPTIMIZE_OLDER_THAN_MS = 14 * 24 * 60 * 60 * 1000; // 14 days
const KEEP_MIN_ITEMS = 5;

const serviceHandlers: ServiceHandlers<Bucket> = {
  get: db.getBucket,
  getAll: db.getAllBuckets,
  add: db.addBucket,
  addAll: db.addBuckets,
  update: db.updateBucket,
  updateAll: db.updateBuckets,
  deleteAll: db.deleteBuckets,
};

const generateTransactionSummary = (transaction: Transaction) =>
  `${new Date(transaction.date).toLocaleDateString()}: ${transaction.description ?? 'No description'} (${transaction.amount})`;

export const bucketService = {
  ...createService('bucket', serviceHandlers),
  optimize: async (bucketId: string, user: User) => {
    const transactions = (await transactionService.getAllBy('bucketId', [bucketId], user))
      .sort((transactionA, transactionB) => Date.parse(transactionA.date) - Date.parse(transactionB.date));
    const foundMergedTransaction = transactions.find((transaction) => transaction.isMergedTransaction);
    if (foundMergedTransaction) {
      await transactionService.deleteAll([foundMergedTransaction.id], user);
    }
    const mergeOlderThanMs = Date.now() - OPTIMIZE_OLDER_THAN_MS;
    const toBeMergedTransactions = transactions.filter((transaction, index) => {
      const date = Date.parse(transaction.date);
      return index < transactions.length - KEEP_MIN_ITEMS && date <= mergeOlderThanMs && !transaction.isMergedTransaction;
    });
    const newMergedTransaction: Partial<Transaction> = {
      bucketId,
      userId: user.id,
      amount: toBeMergedTransactions.reduce((currentAmount, transaction) => currentAmount + transaction.amount, 0),
      date: toBeMergedTransactions[0].date,
      description: toBeMergedTransactions.map((transaction) => generateTransactionSummary(transaction)).join('; '),
      isMergedTransaction: true,
    };
    const savedMergedTransaction = await transactionService.add(newMergedTransaction, user);
    const toBeSavedTransactions: Partial<Transaction>[] = toBeMergedTransactions.map((transaction) => ({ id: transaction.id, mergedTransactionId: savedMergedTransaction.id }));
    await transactionService.updateOrAdd(toBeSavedTransactions, user);
  },
};
