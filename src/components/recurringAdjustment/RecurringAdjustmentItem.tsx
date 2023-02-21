import { Button, List, Space, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { RecurringAdjustment } from '@/models';
import { useUserConfigContext } from '@/context';
import { toCurrency } from '@/utils/toCurrency';
import { useCallback } from 'react';
import { ButtonDelete } from '../ButtonDelete';
import { RecurringItemAvatar } from '../RecurringItemAvatar';

const { Text } = Typography;

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
        <Button key={`${recurringAdjustment.id}_edit`} type="text" onClick={handleEditClicked}><EditOutlined /></Button>,
        <ButtonDelete key={`${recurringAdjustment.id}_delete`} itemName="recurring adjustment" onConfirm={handleDeleteClicked} />
      ]}
    >
      <List.Item.Meta
        avatar={<RecurringItemAvatar intervalType={recurringAdjustment.intervalType} interval={recurringAdjustment.interval} date={recurringAdjustment.initialDate} />}
        title={recurringAdjustment.label}
        description={recurringAdjustment.description}
      />
      <Space>
        {recurringAdjustment.isLimited && <Text type="warning">({recurringAdjustment.amountLeft} occurences left)</Text>}
        {toCurrency(recurringAdjustment.amount, locale, currency)}
      </Space>
    </List.Item>
  );
};
