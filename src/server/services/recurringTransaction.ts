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

const service = createService('recurringTransaction', serviceHandlers);

const MAX_NEW_TRANSACTIONS = 50;
const createNewTransactions = async (user: User, recurringTransactions: RecurringTransaction[], account: Account): Promise<Transaction[]> => {
  const updateRecurringTransactions: Partial<RecurringTransaction>[] = [];
  const newTransactions = recurringTransactions.reduce((currentNewTransactions: Partial<Transaction>[], recurringTransaction) => {
    const occurences = calculateOccurences({
      interval: recurringTransaction.interval,
      initialDate: recurringTransaction.initialDate,
      calculateStartDate: account.lastAccess ?? recurringTransaction.initialDate ?? Date.now(),
      calculateEndDate: Date.now(),
      limit: Math.min(recurringTransaction.isLimited ? recurringTransaction.amountLeft : MAX_NEW_TRANSACTIONS, MAX_NEW_TRANSACTIONS),
      intervalType: recurringTransaction.intervalType,
    });
    if (!occurences) {
      throw new Error('Failed to calculate occurences');
    }
    const counter = recurringTransaction.counter ?? 0;
    const transactions: Partial<Transaction>[] = occurences.map((occurence, index) => ({
      userId: recurringTransaction.userId,
      bucketId: recurringTransaction.bucketId,
      amount: recurringTransaction.amount,
      date: new Date(occurence).toISOString(),
      description: recurringTransaction.description.replace(/%c/g, String(counter + index)),
      recurringTransactionId: recurringTransaction.id,
    }));
    if (occurences.length > 0) {
      updateRecurringTransactions.push({
        id: recurringTransaction.id,
        counter: counter + occurences.length,
        amountLeft: recurringTransaction.isLimited ? (recurringTransaction.amountLeft ?? 0) - occurences.length : recurringTransaction.amountLeft,
      });
    }
    return [
      ...currentNewTransactions,
      ...transactions,
    ];
  }, []);
  const addedTransactions = await transactionService.updateOrAdd(newTransactions, user);
  await service.updateOrAdd(updateRecurringTransactions, user);
  return addedTransactions.map((transaction) => ({ ...transaction, isNew: true }));
};

export const recurringTransactionService = {
  ...service,
  createNewTransactions,
};
