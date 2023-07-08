import { Button, Space, Typography, Input } from 'antd';
import { ToolsBar } from '@/components/toolsBar/ToolsBar';

import styles from '@/styles/ImportPage.module.css';
import { useCallback, useState } from 'react';
import { useAccountContext, useDataContext } from '@/context';
import { useRouter } from 'next/router';

const { Text, Title } = Typography;

export default function ImportPage() {
  const router = useRouter();
  const { account } = useAccountContext();
  const [maxTransactions, setMaxTransactions] = useState<string>('5');
  const { optimizeAllBuckets } = useDataContext();

  const handleOptimizeClicked = useCallback(() => {
    if (!account.id) {
      return;
    }
    optimizeAllBuckets(account.id, Number.parseInt(maxTransactions))
      .then(() => {
        router.push(`/accounts/${account.id}`);
      });
  }, [account, router, maxTransactions, optimizeAllBuckets]);

  const handleMaxTransactionsChange = useCallback((e: any) => {
    setMaxTransactions(e.target.value);
  }, [setMaxTransactions]);

  return (
    <div className={styles.page}>
      <ToolsBar />
      <div className={styles.main}>
        <Space direction="vertical">
          <Title>Optimize Buckets</Title>
          <Text>Clicking the button below will optimize all buckets for the currently selected account. It will merge older transactions into one single transactions, reducing the amount of transactions in a list and improving page load.</Text>
          <Text>You can define the maximum amount of transactions you want to keep in a single bucket.</Text>
          <Input addonBefore="Max transactions" value={maxTransactions} onChange={handleMaxTransactionsChange} style={{ width: 180 }} />

          <Button type="primary" onClick={handleOptimizeClicked} style={{ marginTop: 16 }}>Optimize</Button>
        </Space>
      </div>
    </div>
  );
}
