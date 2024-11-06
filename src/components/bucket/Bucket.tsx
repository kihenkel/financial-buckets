import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Space, Typography } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import { useDataContext, useUserConfigContext } from '@/context';
import { Bucket as BucketModel, Transaction } from '@/models';
import { toCurrency } from '@/utils/toCurrency';

import { EditableText } from '../EditableText/EditableText';
import { BucketShell } from './BucketShell';
import { TransactionList } from '../transaction/TransactionList';
import { AddTransaction } from '../transaction/AddTransaction';

import styles from '@/styles/Bucket.module.css';
import { ButtonDelete } from '../ButtonDelete';
import { ButtonOptimizeBucket } from '../ButtonOptimizeBucket';
import { ButtonArchive } from '../ButtonArchive';

const { Text } = Typography;

interface BucketProps {
  bucket: BucketModel;
  transactions: Transaction[];
  balance: number;
}

const validateTarget = (newAmount: string) => {
  return !isNaN(Number.parseFloat(newAmount)) || newAmount === '';
};

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

  const handleArchiveConfirmed = useCallback(() => {
    updateData({
      buckets: [{
        id: bucket.id,
        userId: bucket.userId,
        isArchived: true,
      }]
    }, true);
  }, [bucket, updateData]);

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

  const handleTargetChanged = useCallback((targetString: string) => {
    const newTarget = targetString === '' ? -1 : Number.parseFloat(targetString);
    updateData({
      buckets: [{
        id: bucket.id,
        userId: bucket.userId,
        target: newTarget,
      }]
    });
  }, [bucket, updateData]);

  const formattedBalance = useMemo(() =>
    toCurrency(balance, locale, currency),
    [balance, locale, currency]);

  const bucketTarget = useMemo(() => (
    bucket.target ?
      <div className={styles.bucketTarget}>
        Target:&nbsp;
        <EditableText
          text={toCurrency(bucket.target, locale, currency)}
          textProps={{ style: { fontSize: 10 } }}
          inputProps={{ style: { fontSize: 10 } }}
          onEdit={handleTargetChanged}
          validate={validateTarget}
          clearOnSelect
          allowEmpty
        />
      </div> : null
  ), [bucket.target, locale, currency, handleTargetChanged]);

  const titleComponent = useMemo(() => (
    <>
      <Space onClick={handleTitleClicked} style={{ justifyContent: 'space-between', width: '100%', cursor: 'pointer' }} className={styles.bucketTitle}>
        {!isEditMode &&
          <>
            <EditableText text={bucket.name} onEdit={handleNameChange} />
            <Text strong>{formattedBalance}</Text>
          </>
        }
        {isEditMode &&
          <Space align="end" style={{ gap: '0px' }}>
            <Button onClick={() => handleTargetChanged('1')} size="small" type="text"><AimOutlined /></Button>
            <ButtonArchive onConfirm={handleArchiveConfirmed} />
            <ButtonOptimizeBucket onConfirm={handleOptimizeConfirmed} />
            <ButtonDelete itemName="bucket" onConfirm={handleDeleteConfirmed} />
          </Space>
        }
      </Space>
      {bucketTarget}
    </>
  ), [bucket.name, bucketTarget, formattedBalance, isEditMode, handleDeleteConfirmed, handleOptimizeConfirmed, handleNameChange, handleTitleClicked, handleTargetChanged, handleArchiveConfirmed]);

  return (
    <BucketShell title={titleComponent} style={{ height: 350 }}>
      <Space direction="vertical" size="middle">
        <TransactionList listRef={listRef} transactions={transactions} />
        {bucket.id && <AddTransaction bucket={bucket} />}
      </Space>
    </BucketShell>
  );
};
