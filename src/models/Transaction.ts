import { DatabaseModel } from './DatabaseModel';

export const transactionDisplayName = 'Transaction';

export interface Transaction extends DatabaseModel {
  bucketId: string;
  amount: number;
  date: string;
  description: string;
  recurringTransactionId: string;
  mergedTransactionId: string;
  isMergedTransaction: boolean;
  isNew: boolean;
}
