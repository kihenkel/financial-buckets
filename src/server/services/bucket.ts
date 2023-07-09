import { Bucket, Transaction, User } from '@/models';
import db from '@/server/db';
import { createService, ServiceHandlers } from './createService';
import { transactionService } from './transaction';

const MAX_MERGED_DESCRIPTION_LENGTH = 256;

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
  optimize: async (bucketId: string, maxTransactions: number, user: User) => {
    const transactions = (await transactionService.getAllBy('bucketId', [bucketId], user))
      .sort((transactionA, transactionB) => Date.parse(transactionA.date) - Date.parse(transactionB.date));
    const foundMergedTransaction = transactions.find((transaction) => transaction.isMergedTransaction);
    if (foundMergedTransaction) {
      await transactionService.deleteAll([foundMergedTransaction.id], user);
    }
    const toBeMergedTransactions = transactions.filter((transaction, index) => {
      return index < transactions.length - maxTransactions && !transaction.isMergedTransaction;
    });
    if (toBeMergedTransactions.length <= 0) {
      // Nothing to optimize
      return;
    }
    const fullDescription = toBeMergedTransactions.map((transaction) => generateTransactionSummary(transaction)).join('; ');
    const description = fullDescription.length > MAX_MERGED_DESCRIPTION_LENGTH ?
      `${fullDescription.substring(0, MAX_MERGED_DESCRIPTION_LENGTH / 2)} [...] ${fullDescription.substring(fullDescription.length - (MAX_MERGED_DESCRIPTION_LENGTH / 2))}` :
      fullDescription;
    const newMergedTransaction: Partial<Transaction> = {
      bucketId,
      userId: user.id,
      amount: toBeMergedTransactions.reduce((currentAmount, transaction) => currentAmount + transaction.amount, 0),
      date: toBeMergedTransactions[0].date,
      description,
      isMergedTransaction: true,
    };
    const savedMergedTransaction = await transactionService.add(newMergedTransaction, user);
    const toBeSavedTransactions: Partial<Transaction>[] = toBeMergedTransactions.map((transaction) => ({ id: transaction.id, mergedTransactionId: savedMergedTransaction.id }));
    await transactionService.updateOrAdd(toBeSavedTransactions, user);
  },
};
