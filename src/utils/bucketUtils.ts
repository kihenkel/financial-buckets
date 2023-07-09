import { Bucket as BucketModel, Transaction, Adjustment } from '@/models';

export const getMainBalance = (accountBalance: number, bucketTotalBalance: number, adjustmentsTotalBalance: number): number => {
  return accountBalance - bucketTotalBalance - adjustmentsTotalBalance;
};

export const getAdjustmentsTotal = (adjustments: Adjustment[]) => adjustments.reduce((currentBalance, adjustment) => currentBalance + adjustment.amount, 0);

export const getBucketsTotal = (bucketBalances: number[]) => bucketBalances.reduce((currentBalance, balance) => currentBalance + balance, 0);

export const getBucketBalances = (bucketTransactions: Transaction[][]): number[] => {
  return bucketTransactions.map((currentTransactions) => {
    return currentTransactions.reduce((currentBalance, transaction) => {
      return currentBalance + transaction.amount;
    }, 0);
  });
};

export const getBucketTransactions = (buckets: BucketModel[], transactions: Transaction[]): Transaction[][] => {
  return buckets.map((bucket) =>
    transactions.filter((transaction) => transaction.bucketId === bucket.id)
      .sort((transactionA, transactionB) => Date.parse(transactionA.date) - Date.parse(transactionB.date))
  );
};
