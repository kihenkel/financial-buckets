import { useCallback, useState } from 'react';
import { Button, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAccountContext, useDataContext, useUserConfigContext } from '@/context';

import styles from '@/styles/Adjustment.module.css';

export const AddAdjustment = () => {
  const { account } = useAccountContext();
  const { updateData } = useDataContext();
  const { currency } = useUserConfigContext();
  const [label, setLabel] = useState<string>('');
  const [amount, setAmount] = useState<string>('');

  const handleSubmit = useCallback(() => {
    const parsedAmount = Number.parseFloat(String(amount));
    if (!isNaN(parsedAmount) && label) {
      updateData({
        adjustments: [{
          accountId: account.id,
          userId: account.userId,
          label,
          amount: parsedAmount,
          date: new Date().toISOString(),
        }]
      });
      setLabel('');
      setAmount('');
    }
  }, [account.id, account.userId, label, amount, updateData, setLabel, setAmount]);

  const handleLabelChange = useCallback((event: any) => {
    setLabel(event.target.value);
  }, [setLabel]);

  const handleAmountChange = useCallback((event: any) => {
    setAmount(event.target.value);
  }, [setAmount]);

  return (
    <Input.Group compact>
      <Input
        style={{ width: '50%' }}
        placeholder="Name"
        value={label}
        onChange={handleLabelChange}
      />
      <Input
        style={{ width: '50%' }}
        addonAfter={<Button className={styles.adjustmentAddButton} onClick={handleSubmit} size="small" type="text"><PlusOutlined /></Button>}
        value={amount}
        placeholder={currency}
        onPressEnter={handleSubmit}
        onChange={handleAmountChange}
      />
    </Input.Group>
  );
};
