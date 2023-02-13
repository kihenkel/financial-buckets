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

  const handleChange = useCallback(() => {
    const parsedAmount = Number.parseFloat(String(amount));
    if (!isNaN(parsedAmount) && label) {
      updateData({
        adjustments: [{
          accountId: account.id,
          userId: account.userId,
          label,
          amount: parsedAmount,
        }]
      });
      setLabel('');
      setAmount('');
    }
  }, [account.id, account.userId, label, amount, updateData, setLabel, setAmount]);

  const onLabelChange = useCallback((event: any) => {
    setLabel(event.target.value);
  }, [setLabel]);

  const onAmountChange = useCallback((event: any) => {
    setAmount(event.target.value);
  }, [setAmount]);

  return (
    <Input.Group compact>
      <Input
        style={{ width: '50%' }}
        placeholder="Name"
        value={label}
        onChange={onLabelChange}
      />
      <Input
        style={{ width: '50%' }}
        addonAfter={<Button className={styles.adjustmentAddButton} onClick={handleChange} size="small" type="text"><PlusOutlined /></Button>}
        value={amount}
        placeholder={currency}
        onChange={onAmountChange}
      />
    </Input.Group>
  );
};
