import React from 'react';
import { Card, List } from 'antd';
import { RecurringAdjustment } from '@/models';
import { RecurringAdjustmentItem } from './RecurringAdjustmentItem';
import { AddRecurringAdjustment } from './AddRecurringAdjustment';

interface AdjustmentListProps {
  recurringAdjustments: RecurringAdjustment[];
}

export const RecurringAdjustmentList = ({ recurringAdjustments }: AdjustmentListProps) => {
  return (
    <Card title="Recurring Adjustments" extra={<AddRecurringAdjustment />}>
      <List
        dataSource={recurringAdjustments}
        itemLayout="horizontal"
        renderItem={(item) => <RecurringAdjustmentItem key={item.id} recurringAdjustment={item} />}
      />
    </Card>
  );
};
