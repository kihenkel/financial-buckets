import { useMemo } from 'react';
import { Space, Typography, List, Table } from 'antd';
import { useUserConfigContext } from '@/context';
import { PageProps } from '@/components/AppContainer';
import { ToolsBar } from '@/components/toolsBar/ToolsBar';

import styles from '@/styles/AccountSummaryPage.module.css';
import { toCurrency } from '@/utils/toCurrency';
import { BucketShell } from '@/components/bucket/BucketShell';
import { Account } from '@/models';
import { Row, Stack } from '@/components/layout/Layout';
import { useAccountValues } from '@/hooks/useAccountValues';
import CDSummary from '@/components/summary/CDSummary';

const { Text } = Typography;

interface CombinedBucket {
  name: string;
  balance: number;
}

export default function AccountSummaryPage({ data }: PageProps) {
  const { locale, currency } = useUserConfigContext();

  const { mainBalance, bucketBalances } = useAccountValues({ ...data });

  const { checkingAccounts, savingsAccounts, cdAccounts } = useMemo(() => {
    return data.accounts.reduce((acc, account) => {
      if (account.type === 'checking') acc.checkingAccounts.push(account);
      if (account.type === 'savings') acc.savingsAccounts.push(account);
      if (account.type === 'cd') acc.cdAccounts.push(account);
      return acc;
    }, { checkingAccounts: [], savingsAccounts: [], cdAccounts: [] } as { checkingAccounts: Account[], savingsAccounts: Account[], cdAccounts: Account[] });
  }, [data]);

  const { mainBalance: checkingBalance } = useAccountValues({ ...data, accounts: checkingAccounts });
  const totalSavingsBalance = useMemo(() => savingsAccounts.reduce((currentValue, account) => currentValue + account.balance, 0), [savingsAccounts]);
  const totalCdBalance = useMemo(() => cdAccounts.reduce((currentValue, account) => currentValue + account.balance, 0), [cdAccounts]);

  const formattedMainBalance = useMemo(() => toCurrency(mainBalance, locale, currency), [mainBalance, locale, currency]);
  const titleComponent = useMemo(() => (
    <Space style={{ justifyContent: 'space-between', width: '100%' }}>
      <Text>All Accounts Total</Text>
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

  const quickSummary = useMemo(() => ([{
    checking: checkingBalance,
    savings: totalSavingsBalance,
    cds: totalCdBalance,
  }]), [checkingBalance, totalSavingsBalance, totalCdBalance]);

  return (
    <div className={styles.page}>
      <ToolsBar />
      {data &&
        <div className={styles.main}>
          <Stack>
            <Table dataSource={quickSummary} pagination={false}>
              <Table.Column title="Checking" dataIndex="checking" key="checking" render={(value) => toCurrency(value, locale, currency)} />
              <Table.Column title="Savings" dataIndex="savings" key="savings" render={(value) => toCurrency(value, locale, currency)} />
              <Table.Column title="CDs" dataIndex="cds" key="cds" render={(value) => toCurrency(value, locale, currency)} />
            </Table>
            <Row>
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
              <Stack justify="flex-start" gap={0}>
                <CDSummary cdAccounts={cdAccounts} />
              </Stack>
            </Row>
          </Stack>
        </div>
      }
    </div>
  );
}
