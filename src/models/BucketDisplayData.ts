import { Transaction } from './Transaction';

export interface BucketDisplayData {
  mainBalance: number;
  bucketBalances: number[];
  bucketTransactions: Transaction[][];
}
