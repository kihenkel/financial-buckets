import { useEffect, useMemo } from 'react';
import { Bucket } from '@/components/bucket/Bucket';
import { MainBucket } from '@/components/bucket/MainBucket';
import { useAccountContext } from '@/context';
import { AddBucket } from '@/components/bucket/AddBucket';
import { AccountBalance } from '@/components/AccountBalance';
import { PageProps } from '@/components/AppContainer';
import { ToolsBar } from '@/components/toolsBar/ToolsBar';
import { getBucketTransactions, getBucketBalances, getBucketsTotal, getAdjustmentsTotal, getMainBalance } from '@/utils/bucketUtils';

import styles from '@/styles/AccountPage.module.css';

export default function AccountPage({ data }: PageProps) {
  const { account } = useAccountContext();

  const sortedBuckets = useMemo(() => [...data.buckets].sort((bucketA, bucketB) => bucketA.order - bucketB.order), [data]);
  const bucketTransactions = useMemo(() => getBucketTransactions(sortedBuckets, data.transactions), [data, sortedBuckets]);
  const bucketBalances = useMemo(() => getBucketBalances(bucketTransactions), [bucketTransactions]);
  const bucketsTotalBalance = useMemo(() => getBucketsTotal(bucketBalances), [bucketBalances]);
  const adjustmentsTotalBalance = useMemo(() => getAdjustmentsTotal(data.adjustments), [data]);
  const mainBalance = useMemo(() => getMainBalance(account.balance ?? 0, bucketsTotalBalance, adjustmentsTotalBalance), [account.balance, bucketsTotalBalance, adjustmentsTotalBalance]);

  useEffect(() => {
    if (account.id) {
      document.cookie = `accountId=${account.id}; path=/;`;
    }
  }, [account.id]);

  return (
    <div className={styles.accountPage}>
      <ToolsBar />
      {data && account.name && account.balance !== undefined &&
        <div className={styles.mainBuckets}>
          <div className={styles.left}>
            <AccountBalance />
            <MainBucket
              name={account.name}
              balance={mainBalance}
              adjustments={data.adjustments}
            />
          </div>
          <div className={styles.right}>
            {sortedBuckets.map((bucket, index) =>
              <Bucket
                key={bucket.id || bucket.temporaryId}
                bucket={bucket}
                balance={bucketBalances[index]}
                transactions={bucketTransactions[index]}
              />
            )}
            <AddBucket amountBuckets={sortedBuckets.length} />
          </div>
        </div>
      }
    </div>
  );
}
