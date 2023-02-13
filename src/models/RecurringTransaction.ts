import { DatabaseModel } from './DatabaseModel';

export const recurringTransactionDisplayName = 'RecurringTransaction';

export type TransactionInterval = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'semiMonthly';

export interface RecurringTransaction extends DatabaseModel {
  bucketId: string;
  amount: number;
  description: string;
  date: string;
  interval: number;
  intervalType: TransactionInterval;
  transactionsLeft: number;
}
