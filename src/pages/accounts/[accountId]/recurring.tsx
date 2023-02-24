import { Space } from 'antd';
import { PageProps } from '@/components/AppContainer';
import { RecurringAdjustmentList } from '@/components/recurringAdjustment/RecurringAdjustmentList';
import { ToolsBar } from '@/components/toolsBar/ToolsBar';

import styles from '@/styles/RecurringItemsPage.module.css';
import { RecurringTransactionList } from '@/components/recurringTransaction/RecurringTransactionList';

export default function RecurringItemsPage({ data }: PageProps) {

  return (
    <div className={styles.page}>
      <ToolsBar />
      <div className={styles.main}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <RecurringAdjustmentList recurringAdjustments={data.recurringAdjustments} />
          {data.buckets?.length > 0 && <RecurringTransactionList buckets={data.buckets} recurringTransactions={data.recurringTransactions} />}
        </Space>
      </div>
    </div>
  );
}
