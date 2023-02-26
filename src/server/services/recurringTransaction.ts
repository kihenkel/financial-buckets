import { Account, RecurringTransaction, Transaction, User } from '@/models';
import db from '@/server/db';
import { calculateOccurences } from '@/utils/calculateOccurences';
import { createService, ServiceHandlers } from './createService';
import { transactionService } from './transaction';

const serviceHandlers: ServiceHandlers<RecurringTransaction> = {
  get: db.getRecurringTransaction,
  getAll: db.getAllRecurringTransactions,
  add: db.addRecurringTransaction,
  addAll: db.addRecurringTransactions,
  update: db.updateRecurringTransaction,
  updateAll: db.updateRecurringTransactions,
  deleteAll: db.deleteRecurringTransactions,
};

const MAX_NEW_TRANSACTIONS = 50;
const createNewTransactions = async (user: User, recurringTransactions: RecurringTransaction[], account: Account): Promise<Transaction[]> => {
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
  const addedTransactions = await transactionService.updateOrAdd(newTransactions, user);
  return addedTransactions.map((transaction) => ({ ...transaction, isNew: true }));
};

export const recurringTransactionService = {
  ...createService('recurringTransaction', serviceHandlers),
  createNewTransactions,
};
