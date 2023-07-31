import { useMemo } from 'react';
import { Space, Typography, List } from 'antd';
import { useUserConfigContext } from '@/context';
import { PageProps } from '@/components/AppContainer';
import { ToolsBar } from '@/components/toolsBar/ToolsBar';
import { getBucketTransactions, getBucketBalances, getBucketsTotal, getAdjustmentsTotal, getMainBalance } from '@/utils/bucketUtils';

import styles from '@/styles/AccountSummaryPage.module.css';
import { toCurrency } from '@/utils/toCurrency';
import { BucketShell } from '@/components/bucket/BucketShell';

const { Text } = Typography;

interface CombinedBucket {
  name: string;
  balance: number;
}

export default function AccountSummaryPage({ data }: PageProps) {
  const { locale, currency } = useUserConfigContext();

  const totalAccountBalance = useMemo(() => data.accounts.reduce((currentValue, account) => currentValue + account.balance, 0), [data]);
  const bucketTransactions = useMemo(() => getBucketTransactions(data.buckets, data.transactions), [data]);
  const bucketBalances = useMemo(() => getBucketBalances(bucketTransactions), [bucketTransactions]);
  const bucketsTotalBalance = useMemo(() => getBucketsTotal(bucketBalances), [bucketBalances]);
  const adjustmentsTotalBalance = useMemo(() => getAdjustmentsTotal(data.adjustments), [data]);
  const mainBalance = useMemo(() => getMainBalance(totalAccountBalance, bucketsTotalBalance, adjustmentsTotalBalance), [totalAccountBalance, bucketsTotalBalance, adjustmentsTotalBalance]);

  const formattedMainBalance = useMemo(() => toCurrency(mainBalance, locale, currency), [mainBalance, locale, currency]);
  const titleComponent = useMemo(() => (
    <Space style={{ justifyContent: 'space-between', width: '100%' }}>
      <Text>All Accounts</Text>
      <Text strong>{formattedMainBalance}</Text>
    </Space>
  ), [formattedMainBalance]);

  const combinedBuckets = data.buckets.reduce((currentCombinedBuckets, bucket, index) => {
    const foundCombinedBucket = currentCombinedBuckets.find(combinedBucket => combinedBucket.name === bucket.name);
    if (foundCombinedBucket) {
      foundCombinedBucket.balance += bucketBalances[index];
      return currentCombinedBuckets;
    }
    return [...currentCombinedBuckets, {
      name: bucket.name,
      balance: bucketBalances[index],
    }];
  }, [] as CombinedBucket[]);

  return (
    <div className={styles.page}>
      <ToolsBar />
      {data &&
        <div className={styles.main}>
          <BucketShell title={titleComponent} style={{ width: 500, maxWidth: '500px' }}>
            <List
              dataSource={combinedBuckets}
              renderItem={(combinedBucket) => (
                <List.Item>
                  <Space style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Text>{combinedBucket.name}</Text>
                    <Text strong>{toCurrency(combinedBucket.balance, locale, currency)}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </BucketShell>
        </div>
      }
    </div>
  );
}
