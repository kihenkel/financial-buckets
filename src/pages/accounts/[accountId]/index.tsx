import { useMemo } from 'react';
import { Bucket } from '@/components/bucket/Bucket';
import { BucketDisplayData, Bucket as BucketModel, Transaction, Adjustment } from '@/models';
import { MainBucket } from '@/components/bucket/MainBucket';
import { useAccountContext } from '@/context';
import { AddBucket } from '@/components/bucket/AddBucket';
import { AccountBalance } from '@/components/AccountBalance';
import { PageProps } from '@/components/AppContainer';
import { ToolsBar } from '@/components/toolsBar/ToolsBar';

import styles from '@/styles/AccountPage.module.css';

const getBucketDisplayData = (accountBalance: number, buckets: BucketModel[], transactions: Transaction[], adjustments: Adjustment[]): BucketDisplayData => {
  const bucketTransactions = buckets.map((bucket) =>
    transactions.filter((transaction) => transaction.bucketId === bucket.id)
      .sort((transactionA, transactionB) => Date.parse(transactionA.date) - Date.parse(transactionB.date))
  );
  const bucketBalances = buckets.map((_bucket, index) => {
    return bucketTransactions[index].reduce((currentBalance, transaction) => {
      return currentBalance + transaction.amount;
    }, 0);
  });
  const bucketsTotal = bucketBalances.reduce((currentBalance, balance) => currentBalance + balance, 0);
  const adjustmentsTotal = adjustments.reduce((currentBalance, adjustment) => currentBalance + adjustment.amount, 0);

  return {
    mainBalance: accountBalance - bucketsTotal - adjustmentsTotal,
    bucketBalances: bucketBalances,
    bucketTransactions,
  };
};

export default function AccountPage({ data }: PageProps) {
  const { account } = useAccountContext();

  const bucketDisplayData: BucketDisplayData = useMemo(() => {
    if (!account.balance || !data?.buckets || !data?.transactions) {
      return { mainBalance: 0, bucketBalances: [], bucketTransactions: [] };
    }
    return getBucketDisplayData(account.balance, data.buckets, data.transactions, data.adjustments);
  }, [data, account]);

  return (
    <div className={styles.accountPage}>
      <ToolsBar />
      {data && account.name && account.balance !== undefined &&
        <div className={styles.mainBuckets}>
          <div className={styles.left}>
            <AccountBalance />
            <MainBucket
              name={account.name}
              balance={bucketDisplayData.mainBalance}
              adjustments={data.adjustments}
            />
          </div>
          <div className={styles.right}>
            {data.buckets.map((bucket, index) =>
              <Bucket
                key={bucket.id || index}
                bucket={bucket}
                balance={bucketDisplayData.bucketBalances[index]}
                transactions={bucketDisplayData.bucketTransactions[index]}
              />
            )}
            <AddBucket amountBuckets={data.buckets.length} />
          </div>
        </div>
      }
    </div>
  );
}
