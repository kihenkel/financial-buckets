import { Account, Adjustment, Bucket, Transaction } from '@/models';
import { getAdjustmentsTotal, getBucketBalances, getBucketsTotal, getBucketTransactions, getMainBalance } from '@/utils/bucketUtils';
import { useMemo } from 'react';

interface UseAccountValuesPropsBase {
  accounts?: Account[];
  account?: Account;
  buckets: Bucket[];
  transactions: Transaction[];
  adjustments: Adjustment[];
}

export interface UseAccountValuesProps extends UseAccountValuesPropsBase {
  account: Account;
}

export interface UseAccountsValuesProps extends UseAccountValuesPropsBase {
  accounts: Account[];
}

export const useAccountValues = ({ accounts: inputAccounts, account, buckets, transactions, adjustments }: UseAccountValuesProps | UseAccountsValuesProps) => {
  const accounts = useMemo(() => {
    if (inputAccounts) return inputAccounts;
    else if (account) return [account];
    return [];
  }, [inputAccounts, account]);
  const filteredBuckets = useMemo(() => buckets.filter(bucket => accounts.some(account => bucket.accountId === account.id)), [accounts, buckets]);
  const filteredTransactions = useMemo(() => transactions.filter(transaction => filteredBuckets.some(bucket => transaction.bucketId === bucket.id)), [transactions, filteredBuckets]);
  const filteredAdjustments = useMemo(() => adjustments.filter(adjustment => accounts.some(account => adjustment.accountId === account.id)), [accounts, adjustments]);
  
  const accountBalance = useMemo(() => accounts.reduce((currentValue, account) => currentValue + account.balance, 0), [accounts]);
  const bucketTransactions = useMemo(() => getBucketTransactions(filteredBuckets, filteredTransactions), [filteredBuckets, filteredTransactions]);
  const bucketBalances = useMemo(() => getBucketBalances(bucketTransactions), [bucketTransactions]);
  const bucketsTotalBalance = useMemo(() => getBucketsTotal(bucketBalances), [bucketBalances]);
  const adjustmentsTotalBalance = useMemo(() => getAdjustmentsTotal(filteredAdjustments), [filteredAdjustments]);
  const mainBalance = useMemo(() => getMainBalance(accountBalance, bucketsTotalBalance, adjustmentsTotalBalance), [accountBalance, bucketsTotalBalance, adjustmentsTotalBalance]);

  return {
    accountBalance,
    bucketTransactions,
    bucketBalances,
    bucketsTotalBalance,
    adjustmentsTotalBalance,
    mainBalance,
  };
};
