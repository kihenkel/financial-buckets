import { Button, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAccountContext, useDataContext, useUserConfigContext } from '@/context';
import { EventHandler, useCallback, useState } from 'react';
import { Bucket } from '@/models';

import styles from '@/styles/Transaction.module.css';

interface AddTransactionProps {
  bucket: Bucket;
}

export const AddTransaction = ({ bucket }: AddTransactionProps) => {
  const { account } = useAccountContext();
  const { updateData } = useDataContext();
  const { currency } = useUserConfigContext();
  const [value, setValue] = useState<number | null>(null);

  const handleAddTransaction = useCallback<EventHandler<any>>(() => {
    const amount = Number.parseFloat(String(value));
    if (!isNaN(amount)) {
      updateData({
        transactions: [{
          bucketId: bucket.id,
          date: new Date().toISOString(),
          userId: account.userId,
          amount,
        }]
      });
      setValue(null);
    }
  }, [value, account.userId, bucket, updateData, setValue]);

  const handleValueChange = useCallback((newValue: number | null) => {
    const parsedAmount = Number.parseFloat(String(newValue));
    if (!isNaN(parsedAmount) || !newValue) {
      setValue(newValue);
    }
  }, [setValue]);
  return (
    <>
      <InputNumber
        addonAfter={<Button className={styles.transactionAddButton} onClick={handleAddTransaction} size="small" type="text">{<PlusOutlined />}</Button>}
        onPressEnter={handleAddTransaction}
        onChange={handleValueChange}
        controls={false}
        value={value}
        placeholder={currency}
      />
    </>
  );
};
