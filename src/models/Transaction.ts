import { DatabaseModel } from './DatabaseModel';

export const transactionDisplayName = 'Transaction';

export interface Transaction extends DatabaseModel {
  bucketId: string;
  amount: number;
  timestamp: number;
  refBucketId: string;
  description: string;
  recurringTransactionId: string;
}
