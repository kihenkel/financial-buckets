import { useMemo } from 'react';
import { Space, Typography, List, Table } from 'antd';
import { useUserConfigContext } from '@/context';
import { PageProps } from '@/components/AppContainer';
import { ToolsBar } from '@/components/toolsBar/ToolsBar';
import { getBucketTransactions, getBucketBalances, getBucketsTotal, getAdjustmentsTotal, getMainBalance } from '@/utils/bucketUtils';

import styles from '@/styles/AccountSummaryPage.module.css';
import { toCurrency } from '@/utils/toCurrency';
import { BucketShell } from '@/components/bucket/BucketShell';
import { Account } from '@/models';
import { calculateCDInterest, toPercentage } from '@/utils/numberUtils';
import { toLocalDate } from '@/utils/dateUtils';
import { N_A } from '@/utils/stringUtils';

const { Text } = Typography;

interface CDAccount extends Account {
  estimatedInterest: number;
}

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

  const cdAccounts: CDAccount[] = useMemo(() => {
    return data.accounts
      .filter((account) => account.type === 'cd')
      .map((account) => {
        const { balance, interestRate, openDate, maturityDate } = account;
        const estimatedInterest: number = interestRate && openDate && maturityDate ? 
          calculateCDInterest(balance, interestRate * 100, new Date(openDate), new Date(maturityDate)) :
          -1;
        return {
          ...account,
          estimatedInterest,
        };
      })
      .sort((a, b) => {
        if (!a.maturityDate) return 1;
        if (!b.maturityDate) return -1;
        return new Date(a.maturityDate).valueOf() - new Date(b.maturityDate).valueOf();
      });
  }, [data]);

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
          <Table<CDAccount> dataSource={cdAccounts}>
            <Table.Column title="Name" dataIndex="name" key="name" />
            <Table.Column title="Initial Deposit" dataIndex="balance" key="initialDeposit" render={(value: number) => toCurrency(value, locale, currency)} />
            <Table.Column title="Open Date" dataIndex="openDate" key="openDate" render={toLocalDate} />
            <Table.Column title="Maturity Date" dataIndex="maturityDate" key="maturityDate" render={toLocalDate} />
            <Table.Column title="Interest Rate" dataIndex="interestRate" key="interestRate" render={(value: string) => toPercentage(value, locale)} />
            <Table.Column title="Estimated Interest" dataIndex="estimatedInterest" key="estimatedInterest" render={(value: number) => value >= 0 ? toCurrency(value, locale, currency) : N_A } />
          </Table>
        </div>
      }
    </div>
  );
}
