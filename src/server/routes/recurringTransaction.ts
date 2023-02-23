import db from '@/server/db';
import { User, RecurringTransaction, Bucket, Transaction, Account } from '@/models';
import { Query } from '@/server/db/Query';
import logger from '../logger';
import { chainPromises } from '@/utils/chainPromises';
import { calculateOccurences } from '@/utils/calculateOccurences';
import { updateTransactions } from './transaction';

async function updateRecurringTransaction(newRecurringTransaction: Partial<RecurringTransaction>, user: User): Promise<RecurringTransaction> {
  if (!newRecurringTransaction.id) {
    throw new Error('Failed to update: Missing recurringTransaction id!');
  }
  logger.info(`Updating recurringTransaction ${newRecurringTransaction.id} ...`);
  const query = new Query<RecurringTransaction>().findById(newRecurringTransaction.id).findBy('userId', user.id);
  const updatedRecurringTransaction = await db.updateRecurringTransaction(query, newRecurringTransaction);
  if (!updatedRecurringTransaction) {
    logger.warning(`Could not find and update recurringTransaction with id ${newRecurringTransaction.id} and userId ${user.id}!`);
  }
  return updatedRecurringTransaction;
}

async function addRecurringTransaction(newRecurringTransaction: Partial<RecurringTransaction>, user: User): Promise<RecurringTransaction> {
  logger.info(`Adding new recurringTransaction for user ${user.id} ...`);
  if (newRecurringTransaction.userId !== user.id) {
    throw new Error(`User id from recurringTransaction ${newRecurringTransaction.userId} and signed in user ${user.id} dont match. Aborting recurringTransaction creation!`);
  }
  return db.addRecurringTransaction(newRecurringTransaction);
}

async function updateOrAddRecurringTransaction(newRecurringTransaction: Partial<RecurringTransaction>, user: User): Promise<RecurringTransaction> {
  if (newRecurringTransaction.id) {
    return updateRecurringTransaction(newRecurringTransaction, user);
  } else {
    return addRecurringTransaction(newRecurringTransaction, user);
  }
}

export function getRecurringTransactions(user: User, buckets: Bucket[]): Promise<RecurringTransaction[]> {
  const bucketIds = buckets.map((bucket) => bucket.id);
  const query = new Query<RecurringTransaction>().findBy('userId', user.id).findBy('bucketId', bucketIds);
  return db.getAllRecurringTransactions(query);
}

export async function updateRecurringTransactions(newRecurringTransactions: Partial<RecurringTransaction>[], user: User): Promise<RecurringTransaction[]> {
  logger.info(`Updating ${newRecurringTransactions.length} recurringTransactions ...`);

  const updatedRecurringTransactions = await chainPromises(newRecurringTransactions, (recurringTransaction: Partial<RecurringTransaction>) => updateOrAddRecurringTransaction(recurringTransaction, user));
  return updatedRecurringTransactions;
}

export async function deleteRecurringTransactions(ids: string[], user: User): Promise<void> {
  logger.info(`Deleting ${ids.length} recurringTransactions ...`);
  const query = new Query<RecurringTransaction>().findByIds(ids).findBy('userId', user.id);
  return db.deleteRecurringTransactions(query);
}

export async function deleteRecurringTransactionsByBucket(bucketId: string, user: User): Promise<void> {
  logger.info(`Deleting all recurringTransactions for bucket ${bucketId} ...`);

  const query = new Query<RecurringTransaction>().findBy('bucketId', bucketId).findBy('userId', user.id);
  await db.deleteRecurringTransactions(query);
}

const MAX_NEW_TRANSACTIONS = 50;
export async function createNewTransactions(user: User, recurringTransactions: RecurringTransaction[], account: Account): Promise<Transaction[]> {
  const newTransactions = recurringTransactions.reduce((currentNewTransactions: Partial<Transaction>[], recurringTransaction) => {
    const occurences = calculateOccurences({
      interval: recurringTransaction.interval,
      initialDate: recurringTransaction.initialDate,
      calculateStartDate: account.lastAccess ?? recurringTransaction.initialDate ?? Date.now(),
      calculateEndDate: Date.now(),
      limit: Math.min(recurringTransaction.amountLeft ?? MAX_NEW_TRANSACTIONS, MAX_NEW_TRANSACTIONS),
      intervalType: recurringTransaction.intervalType,
    });
    if (!occurences) {
      throw new Error('Failed to calculate occurences');
    }
    const transactions: Partial<Transaction>[] = occurences.map((occurence) => ({
      userId: recurringTransaction.userId,
      bucketId: recurringTransaction.bucketId,
      amount: recurringTransaction.amount,
      date: new Date(occurence).toISOString(),
      description: recurringTransaction.description,
      recurringTransactionId: recurringTransaction.id,
    }));
    return [
      ...currentNewTransactions,
      ...transactions,
    ];
  }, []);
  const addedTransactions = await updateTransactions(newTransactions, user);
  return addedTransactions.map((transaction) => ({ ...transaction, isNew: true }));
}
