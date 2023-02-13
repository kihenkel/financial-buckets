import { Button, InputNumber } from 'antd';
import { PlusOutlined, FileSyncOutlined } from '@ant-design/icons';
import { useAccountContext, useDataContext, useUserConfigContext } from '@/context';
import { EventHandler, useCallback, useState } from 'react';
import { Bucket } from '@/models';

import styles from '@/styles/Transaction.module.css';
import { RecurringItemDrawer } from '../RecurringItemDrawer';
import { RecurringTransactionForm } from './RecurringTransactionForm';

interface AddTransactionProps {
  bucket: Bucket;
}

export const AddTransaction = ({ bucket }: AddTransactionProps) => {
  const { account } = useAccountContext();
  const { updateData } = useDataContext();
  const { currency } = useUserConfigContext();
  const [value, setValue] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleAddTransaction = useCallback<EventHandler<any>>((event) => {
    if (!value) {
      setDrawerOpen(true);
      return;
    }
    const amount = Number.parseFloat(String(event.target.value));
    if (!isNaN(amount)) {
      updateData({
        transactions: [{
          bucketId: bucket.id,
          timestamp: Date.now(),
          userId: account.userId,
          amount,
        }]
      });
      setValue(null);
    }
  }, [account.userId, bucket, updateData, setValue]);

  const handleValueChange = useCallback((newValue: number | null) => {
    const parsedAmount = Number.parseFloat(String(newValue));
    if (!isNaN(parsedAmount) || !newValue) {
      setValue(newValue);
    }
  }, [setValue]);

  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
  }, [setDrawerOpen]);

  const addButtonIcon = value ? <PlusOutlined /> : <FileSyncOutlined />;
  return (
    <>
      <InputNumber
        addonAfter={<Button className={styles.transactionAddButton} onClick={handleAddTransaction} size="small" type="text">{addButtonIcon}</Button>}
        onPressEnter={handleAddTransaction}
        onChange={handleValueChange}
        controls={false}
        value={value}
        placeholder={currency}
      />
      {drawerOpen && (
        <RecurringItemDrawer itemName="transaction" onClose={handleDrawerClose}>
          <RecurringTransactionForm />
        </RecurringItemDrawer>
      )}
    </>
  );
};
