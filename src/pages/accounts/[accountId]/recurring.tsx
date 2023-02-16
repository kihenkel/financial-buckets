import { Space } from 'antd';
import { PageProps } from '@/components/AppContainer';
import { RecurringAdjustmentList } from '@/components/recurringAdjustment/RecurringAdjustmentList';
import { ToolsBar } from '@/components/tools-bar/ToolsBar';

import styles from '@/styles/RecurringItemsPage.module.css';

export default function RecurringItemsPage({ data }: PageProps) {

  return (
    <div className={styles.page}>
      <ToolsBar />
      <div className={styles.main}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <RecurringAdjustmentList recurringAdjustments={data.recurringAdjustments} />
        </Space>
      </div>
    </div>
  );
}
