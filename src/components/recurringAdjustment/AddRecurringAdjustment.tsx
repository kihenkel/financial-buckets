import { useCallback, useState } from 'react';
import { Button } from 'antd';

import { RecurringItemDrawer } from '../RecurringItemDrawer';
import { RecurringAdjustmentForm } from './RecurringAdjustmentForm';

export const AddRecurringAdjustment = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const onAddClicked = useCallback(() => {
    setIsDrawerOpen(true);
  }, [setIsDrawerOpen]);

  const onDrawerClose = useCallback(() => {
    setIsDrawerOpen(false);
  }, [setIsDrawerOpen]);

  return (
    <>
      <Button type="link" onClick={onAddClicked}>
        Add
      </Button>
      <RecurringItemDrawer itemName="adjustment" isOpen={isDrawerOpen} onClose={onDrawerClose}>
        <RecurringAdjustmentForm />
      </RecurringItemDrawer>
    </>
  );
};
