import React, { useCallback, useMemo, useState } from 'react';
import { Badge, Button, Card, List, Space } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons';
import { Bucket, RecurringTransaction } from '@/models';
import { RecurringTransactionItem } from './RecurringTransactionItem';
import { RecurringItemDrawer } from '../RecurringItemDrawer';
import { useDataContext, useUserContext } from '@/context';
import { RecurringTransactionForm } from './RecurringTransactionForm';
import { sortIntervalItems } from '@/utils/sortIntervalItems';

interface RecurringTransactionMap {
  [key: string]: RecurringTransaction[];
}

interface RecurringTransactionListProps {
  buckets: Bucket[];
  recurringTransactions: RecurringTransaction[];
}

export const RecurringTransactionList = ({ buckets, recurringTransactions }: RecurringTransactionListProps) => {
  const [activeTabKey, setActiveTabKey] = useState<string>(buckets[0].id);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [existingRecurringTransaction, setExistingRecurringTransaction] = useState<RecurringTransaction>();

  const { updateData, deleteData } = useDataContext();
  const { user } = useUserContext();

  const handleFormFinish = useCallback((recurringTransaction: Partial<RecurringTransaction>) => {
    updateData({
      recurringTransactions: [{
        id: existingRecurringTransaction?.id,
        userId: user?.id,
        bucketId: activeTabKey,
        ...recurringTransaction,
      }]
    });
    setIsDrawerOpen(false);
    setExistingRecurringTransaction(undefined);
  }, [user?.id, existingRecurringTransaction, activeTabKey, updateData, setIsDrawerOpen]);

  const handleAddClicked = useCallback(() => {
    setIsDrawerOpen(true);
  }, [setIsDrawerOpen]);

  const handleEditClicked = useCallback((recurringTransaction: RecurringTransaction) => {
    setExistingRecurringTransaction(recurringTransaction);
    setIsDrawerOpen(true);
  }, [setIsDrawerOpen, setExistingRecurringTransaction]);

  const handleDeleteClicked = useCallback((recurringTransaction: RecurringTransaction) => {
    deleteData({ recurringTransactions: [recurringTransaction.id] });
  }, [deleteData]);

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
    setExistingRecurringTransaction(undefined);
  }, [setIsDrawerOpen, setExistingRecurringTransaction]);

  const handleTabChange = useCallback((bucketId: string) => {
    setActiveTabKey(bucketId);
  }, [setActiveTabKey]);

  const recurringAdjustmentsStringified = JSON.stringify(recurringTransactions);
  const bucketsStringified = JSON.stringify(buckets);
  const sortedRecurringTransactionMap = useMemo(() => {
    return buckets.reduce((currentMap, bucket) => {
      const sortedRecurringTransactions = recurringTransactions
        .filter((recurringTransaction) => recurringTransaction.bucketId === bucket.id)
        .sort(sortIntervalItems);
      return {
        ...currentMap,
        [bucket.id]: sortedRecurringTransactions,
      };
    }, {}) as RecurringTransactionMap;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recurringAdjustmentsStringified, bucketsStringified]);

  const tabList = useMemo(() => {
    return buckets.map((bucket) => ({ key: bucket.id, tab: <Space><Badge count={sortedRecurringTransactionMap[bucket.id].length} color='#faad14' />{bucket.name}</Space> }));
  }, [buckets, sortedRecurringTransactionMap]);

  return (
    <>
      <Card
        title={`Recurring Transactions (${recurringTransactions.length})`}
        tabList={tabList}
        extra={<Button type="link" onClick={handleAddClicked}><PlusCircleTwoTone /></Button>}
        activeTabKey={activeTabKey}
        onTabChange={handleTabChange}
      >
        <List
          dataSource={sortedRecurringTransactionMap[activeTabKey]}
          itemLayout="horizontal"
          size="small"
          renderItem={(item) => (
            <RecurringTransactionItem
              key={item.id}
              recurringTransaction={item}
              onClickedEdit={handleEditClicked}
              onClickedDelete={handleDeleteClicked}
            />)}
        />
      </Card>
      <RecurringItemDrawer
        itemName="transaction"
        isOpen={isDrawerOpen}
        onFinish={handleFormFinish}
        onClose={handleDrawerClose}
        formComponent={RecurringTransactionForm}
        existingData={existingRecurringTransaction}
      />
    </>
  );
};
