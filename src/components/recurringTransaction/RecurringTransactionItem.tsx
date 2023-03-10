import { Button, List, Space, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { RecurringTransaction } from '@/models';
import { useUserConfigContext } from '@/context';
import { toCurrency } from '@/utils/toCurrency';
import { useCallback } from 'react';
import { ButtonDelete } from '../ButtonDelete';
import { RecurringItemAvatar } from '../RecurringItemAvatar';

const { Text } = Typography;

interface RecurringTransactionItemProps {
  recurringTransaction: RecurringTransaction;
  onClickedEdit(recurringTransaction: RecurringTransaction): void;
  onClickedDelete(recurringTransaction: RecurringTransaction): void;
}

export const RecurringTransactionItem = ({ recurringTransaction, onClickedEdit, onClickedDelete }: RecurringTransactionItemProps) => {
  const { locale, currency } = useUserConfigContext();

  const handleEditClicked = useCallback(() => {
    onClickedEdit(recurringTransaction);
  }, [recurringTransaction, onClickedEdit]);

  const handleDeleteClicked = useCallback(() => {
    onClickedDelete(recurringTransaction);
  }, [recurringTransaction, onClickedDelete]);

  return (
    <List.Item
      actions={[
        <Button key={`${recurringTransaction.id}_edit`} type="text" onClick={handleEditClicked}><EditOutlined /></Button>,
        <ButtonDelete key={`${recurringTransaction.id}_delete`} itemName="recurring transaction" onConfirm={handleDeleteClicked} />
      ]}
    >
      <List.Item.Meta
        avatar={<RecurringItemAvatar intervalType={recurringTransaction.intervalType} interval={recurringTransaction.interval} date={recurringTransaction.initialDate} />}
        title={recurringTransaction.description}
      />
      <Space>
        {recurringTransaction.isLimited && <Text type="warning">({recurringTransaction.amountLeft} occurences left)</Text>}
        {toCurrency(recurringTransaction.amount, locale, currency)}
      </Space>
    </List.Item>
  );
};
