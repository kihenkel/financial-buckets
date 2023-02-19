import { Button, List, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { RecurringTransaction } from '@/models';
import { useUserConfigContext } from '@/context';
import { toCurrency } from '@/utils/toCurrency';
import { toOrdinalNumber } from '@/utils/toOrdinalNumber';
import { useCallback } from 'react';
import { ButtonDelete } from '../ButtonDelete';
import { RecurringItemAvatar } from '../RecurringItemAvatar';

const { Title } = Typography;

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
        avatar={<RecurringItemAvatar intervalType={recurringTransaction.intervalType} interval={recurringTransaction.interval} date={recurringTransaction.date} />}
        title={recurringTransaction.description}
      />
      <div>
        {toCurrency(recurringTransaction.amount, locale, currency)}
      </div>
    </List.Item>
  );
};
