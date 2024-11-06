import { useCallback, useMemo, useRef } from 'react';
import { Space, Typography } from 'antd';
import { useAccountContext, useUserConfigContext, useDataContext } from '@/context';
import { toCurrency } from '@/utils/toCurrency';
import { BucketShell } from './BucketShell';
import { EditableText } from '../EditableText/EditableText';
import { AdjustmentList } from '../adjustment/AdjustmentList';
import { AddAdjustment } from '../adjustment/AddAdjustment';
import { Adjustment } from '@/models';

const { Text } = Typography;

interface MainBucketProps {
  name: string;
  balance: number;
  adjustments: Adjustment[];
}

export const MainBucket = ({ name, balance, adjustments }: MainBucketProps) => {
  const { locale, currency } = useUserConfigContext();
  const { account } = useAccountContext();
  const { updateData } = useDataContext();
  const listRef = useRef<HTMLDivElement>(null);

  const formattedBalance = useMemo(() => toCurrency(balance, locale, currency), [balance, locale, currency]);

  const handleAccountNameChange = useCallback((newName: string) => {
    updateData({
      accounts: [{
        id: account.id,
        userId: account.userId,
        name: newName,
      }]
    });
  }, [account.id, account.userId, updateData]);

  const titleComponent = useMemo(() => (
    <Space style={{ justifyContent: 'space-between', width: '100%' }}>
      <EditableText text={name} onEdit={handleAccountNameChange} />
      <Text strong>{formattedBalance}</Text>
    </Space>
  ), [name, formattedBalance, handleAccountNameChange]);

  return (
    <BucketShell title={titleComponent}>
      <Space direction="vertical" size="middle">
        <AdjustmentList listRef={listRef} adjustments={adjustments} />
        <AddAdjustment />
      </Space>
    </BucketShell>
  );
};
