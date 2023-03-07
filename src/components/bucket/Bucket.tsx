import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Space, Typography } from 'antd';
import { useDataContext, useUserConfigContext } from '@/context';
import { Bucket as BucketModel, Transaction } from '@/models';
import { toCurrency } from '@/utils/toCurrency';

import { EditableText } from '../EditableText';
import { BucketShell } from './BucketShell';
import { TransactionList } from '../transaction/TransactionList';
import { AddTransaction } from '../transaction/AddTransaction';

import styles from '@/styles/Bucket.module.css';
import { ButtonDelete } from '../ButtonDelete';
import { ButtonOptimizeBucket } from '../ButtonOptimizeBucket';

const { Text } = Typography;

interface BucketProps {
  bucket: BucketModel;
  transactions: Transaction[];
  balance: number;
}

export const Bucket = ({ bucket, transactions, balance }: BucketProps) => {
  const { locale, currency } = useUserConfigContext();
  const { updateData, deleteData, optimizeBucket } = useDataContext();
  const [isEditMode, setIsEditMode] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const scrollListToBottom = useCallback(() => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: listRef.current.scrollHeight });
    }
  }, [listRef]);

  useEffect(() => {
    scrollListToBottom();
  }, [transactions?.length, scrollListToBottom]);

  const handleTitleClicked = useCallback(() => {
    setIsEditMode(!isEditMode);
  }, [isEditMode, setIsEditMode]);

  const handleOptimizeConfirmed = useCallback(() => {
    optimizeBucket(bucket.id);
  }, [bucket.id, optimizeBucket]);

  const handleDeleteConfirmed = useCallback(() => {
    deleteData({
      buckets: [bucket.id]
    });
  }, [bucket.id, deleteData]);

  const handleNameChange = useCallback((newName: string) => {
    updateData({
      buckets: [{
        id: bucket.id,
        userId: bucket.userId,
        name: newName,
      }]
    });
  }, [bucket, updateData]);

  const formattedBalance = useMemo(() =>
    toCurrency(balance, locale, currency),
  [balance, locale, currency]);

  const titleComponent = useMemo(() => (
    <Space onClick={handleTitleClicked} style={{ justifyContent: 'space-between', width: '100%', cursor: 'pointer' }} className={styles.bucketTitle}>
      <EditableText text={bucket.name} onEdit={handleNameChange} />
      <Text strong>{formattedBalance}</Text>
      {isEditMode &&
        <Space align="end" style={{ gap: '0px' }}>
          <ButtonOptimizeBucket onConfirm={handleOptimizeConfirmed} />
          <ButtonDelete itemName="bucket" onConfirm={handleDeleteConfirmed} />
        </Space>
      }
    </Space>
  ), [bucket.name, formattedBalance, isEditMode, handleDeleteConfirmed, handleOptimizeConfirmed, handleNameChange, handleTitleClicked]);

  return (
    <BucketShell title={titleComponent} style={{ height: 350 }}>
      <Space direction="vertical" size="middle">
        <TransactionList listRef={listRef} transactions={transactions} />
        {bucket.id && <AddTransaction bucket={bucket} />}
      </Space>
    </BucketShell>
  );
};
