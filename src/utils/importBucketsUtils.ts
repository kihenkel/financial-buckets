import { Account, Bucket, ImportBucket, Transaction, User } from '@/models';

export const parseBuckets = (importBuckets: ImportBucket[], account: Account, user: User): Partial<Bucket>[] => {
  return importBuckets.map((importBucket) => ({
    userId: user.id,
    accountId: account.id,
    name: importBucket.name,
  }));
};

export const parseTransactions = (importBuckets: ImportBucket[], buckets: Bucket[], user: User): Partial<Transaction>[] => {
  return importBuckets.reduce((currentTransactions: Partial<Transaction>[], importBucket, index) => {
    const transactions: Partial<Transaction>[] = importBucket.transactionAmounts.map((transaction) => ({
      userId: user.id,
      bucketId: buckets[index].id,
      amount: transaction,
      date: new Date().toISOString(),
    }));
    return [
      ...currentTransactions,
      ...transactions
    ];
  }, []);
};