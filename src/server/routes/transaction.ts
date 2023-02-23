import db from '@/server/db';
import { User, Transaction, Bucket } from '@/models';
import { Query } from '@/server/db/Query';
import logger from '../logger';
import { chainPromises } from '@/utils/chainPromises';

export function getTransactions(user: User, buckets: Bucket[]): Promise<Transaction[]> {
  const bucketIds = buckets.map((bucket) => bucket.id);
  const query = new Query<Transaction>().findBy('userId', user.id).findBy('bucketId', bucketIds);
  return db.getAllTransactions(query);
}

async function updateTransaction(newTransaction: Partial<Transaction>, user: User): Promise<Transaction> {
  if (!newTransaction.id) {
    throw new Error('Failed to update: Missing transaction id!');
  }
  logger.info(`Updating transaction ${newTransaction.id} ...`);
  const query = new Query<Transaction>().findById(newTransaction.id).findBy('userId', user.id);
  const updatedTransaction = await db.updateTransaction(query, newTransaction);
  if (!updatedTransaction) {
    logger.warning(`Could not find and update transaction with id ${newTransaction.id} and userId ${user.id}!`);
  }
  return updatedTransaction;
}

export async function addTransaction(newTransaction: Partial<Transaction>, user: User): Promise<Transaction> {
  logger.info(`Adding new transaction for user ${user.id} ...`);
  if (newTransaction.userId !== user.id) {
    throw new Error(`User id from transaction ${newTransaction.userId} and signed in user ${user.id} dont match. Aborting transaction creation!`);
  }
  return db.addTransaction(newTransaction);
}

async function updateOrAddTransaction(newTransaction: Partial<Transaction>, user: User): Promise<Transaction> {
  if (newTransaction.id) {
    return updateTransaction(newTransaction, user);
  } else {
    return addTransaction(newTransaction, user);
  }
}

export async function updateTransactions(newTransactions: Partial<Transaction>[], user: User): Promise<Transaction[]> {
  if (!newTransactions.length) {
    return [];
  }
  logger.info(`Updating ${newTransactions.length} transactions ...`);

  const updatedTransactions = await chainPromises(newTransactions, (transaction: Partial<Transaction>) => updateOrAddTransaction(transaction, user));
  return updatedTransactions;
}

export async function deleteTransactions(ids: string[], user: User): Promise<void> {
  if (!ids.length) {
    return;
  }
  logger.info(`Deleting ${ids.length} transactions ...`);
  const query = new Query<Transaction>().findByIds(ids).findBy('userId', user.id);
  return db.deleteTransactions(query);
}

export async function deleteTransactionsByBucket(bucketId: string, user: User): Promise<void> {
  logger.info(`Deleting all transactions for bucket ${bucketId} ...`);

  const query = new Query<Transaction>().findBy('bucketId', bucketId).findBy('userId', user.id);
  await db.deleteTransactions(query);
}
