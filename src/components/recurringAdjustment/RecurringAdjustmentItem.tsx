import { Button, List, Typography } from 'antd';
import { RecurringAdjustment } from '@/models';
import { useUserConfigContext } from '@/context';
import { toCurrency } from '@/utils/toCurrency';
import { toOrdinalNumber } from '@/utils/toOrdinalNumber';
import { useCallback } from 'react';
import { ButtonDelete } from '../ButtonDelete';

const { Title } = Typography;

interface RecurringAdjustmentItemProps {
  recurringAdjustment: RecurringAdjustment;
  onClickedEdit(recurringAdjustment: RecurringAdjustment): void;
  onClickedDelete(recurringAdjustment: RecurringAdjustment): void;
}

export const RecurringAdjustmentItem = ({ recurringAdjustment, onClickedEdit, onClickedDelete }: RecurringAdjustmentItemProps) => {
  const { locale, currency } = useUserConfigContext();

  const handleEditClicked = useCallback(() => {
    onClickedEdit(recurringAdjustment);
  }, [recurringAdjustment, onClickedEdit]);

  const handleDeleteClicked = useCallback(() => {
    onClickedDelete(recurringAdjustment);
  }, [recurringAdjustment, onClickedDelete]);

  return (
    <List.Item
      actions={[
        <Button key={`${recurringAdjustment.id}_edit`} type="link" onClick={handleEditClicked}>edit</Button>,
        <ButtonDelete key={`${recurringAdjustment.id}_delete`} itemName="recurring adjustment" onConfirm={handleDeleteClicked} />
      ]}
    >
      <List.Item.Meta
        avatar={<Title level={2} style={{ width: 64 }}>{toOrdinalNumber(recurringAdjustment.dayOfMonth, locale)}</Title>}
        title={recurringAdjustment.label}
        description={recurringAdjustment.description}
      />
      <div>
        {toCurrency(recurringAdjustment.amount, locale, currency)}
      </div>
    </List.Item>
  );
};
