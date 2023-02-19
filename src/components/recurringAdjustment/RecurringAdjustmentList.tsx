import React, { useCallback, useMemo, useState } from 'react';
import { Button, Card, List } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons';
import { RecurringAdjustment } from '@/models';
import { RecurringAdjustmentItem } from './RecurringAdjustmentItem';
import { RecurringItemDrawer } from '../RecurringItemDrawer';
import { useAccountContext, useDataContext, useUserContext } from '@/context';
import { RecurringAdjustmentForm } from './RecurringAdjustmentForm';
import { sortIntervalItems } from '@/utils/sortIntervalItems';

interface AdjustmentListProps {
  recurringAdjustments: RecurringAdjustment[];
}

export const RecurringAdjustmentList = ({ recurringAdjustments }: AdjustmentListProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [existingRecurringAdjustment, setExistingRecurringAdjustment] = useState<RecurringAdjustment>();

  const { updateData, deleteData } = useDataContext();
  const { user } = useUserContext();
  const { account } = useAccountContext();

  const handleFormFinish = useCallback((recurringAdjustment: Partial<RecurringAdjustment>) => {
    updateData({
      recurringAdjustments: [{
        id: existingRecurringAdjustment?.id,
        userId: user?.id,
        accountId: account.id,
        ...recurringAdjustment,
      }]
    });
    setIsDrawerOpen(false);
    setExistingRecurringAdjustment(undefined);
  }, [user?.id, account.id, existingRecurringAdjustment, updateData, setIsDrawerOpen]);

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

  const recurringAdjustmentsStringified = JSON.stringify(recurringAdjustments);
  const sortedRecurringAdjustments = useMemo(() => {
    return [...recurringAdjustments].sort(sortIntervalItems);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recurringAdjustmentsStringified]);

  return (
    <>
      <Card title={`Recurring Adjustments (${sortedRecurringAdjustments.length})`} extra={<Button type="text" onClick={handleAddClicked}><PlusCircleTwoTone /></Button>}>
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
