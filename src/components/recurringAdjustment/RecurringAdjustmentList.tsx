import React, { useCallback, useState } from 'react';
import { Button, Card, List } from 'antd';
import { RecurringAdjustment } from '@/models';
import { RecurringAdjustmentItem } from './RecurringAdjustmentItem';
import { RecurringItemDrawer } from '../RecurringItemDrawer';
import { useAccountContext, useDataContext, useUserContext } from '@/context';
import { RecurringAdjustmentForm } from './RecurringAdjustmentForm';

interface AdjustmentListProps {
  recurringAdjustments: RecurringAdjustment[];
}

export const RecurringAdjustmentList = ({ recurringAdjustments }: AdjustmentListProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [existingRecurringAdjustment, setExistingRecurringAdjustment] = useState<RecurringAdjustment>();

  const { updateData, deleteData } = useDataContext();
  const { user } = useUserContext();
  const { account } = useAccountContext();

  const handleFormFinish = useCallback((recurringAdjustment: any) => {
    updateData({
      recurringAdjustments: [{
        userId: user?.id,
        accountId: account.id,
        ...recurringAdjustment,
      }]
    });
    setIsDrawerOpen(false);
    setExistingRecurringAdjustment(undefined);
  }, [user?.id, account.id, updateData, setIsDrawerOpen]);

  const handleAddClicked = useCallback(() => {
    setIsDrawerOpen(true);
  }, [setIsDrawerOpen]);

  const handleEditClicked = useCallback((recurringAdjustment: RecurringAdjustment) => {
    setExistingRecurringAdjustment(recurringAdjustment);
    setIsDrawerOpen(true);
  }, [setIsDrawerOpen, setExistingRecurringAdjustment]);

  const handleDeleteClicked = useCallback((recurringAdjustment: RecurringAdjustment) => {
    deleteData({ recurringAdjustments: [recurringAdjustment.id] });
  }, [deleteData]);

  const handleDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
    setExistingRecurringAdjustment(undefined);
  }, [setIsDrawerOpen, setExistingRecurringAdjustment]);

  const sortedRecurringAdjustments = [...recurringAdjustments].sort((a, b) => a.dayOfMonth - b.dayOfMonth);

  return (
    <>
      <Card title="Recurring Adjustments" extra={<Button type="link" onClick={handleAddClicked}>Add</Button>}>
        <List
          dataSource={sortedRecurringAdjustments}
          itemLayout="horizontal"
          size="small"
          renderItem={(item) => (
            <RecurringAdjustmentItem
              key={item.id}
              recurringAdjustment={item}
              onClickedEdit={handleEditClicked}
              onClickedDelete={handleDeleteClicked}
            />)}
        />
      </Card>
      <RecurringItemDrawer
        itemName="adjustment"
        isOpen={isDrawerOpen}
        onFinish={handleFormFinish}
        onClose={handleDrawerClose}
        formComponent={RecurringAdjustmentForm}
        existingData={existingRecurringAdjustment}
      />
    </>
  );
};
