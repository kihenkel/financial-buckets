import { List, Tooltip, Typography } from 'antd';
import { FileSyncOutlined } from '@ant-design/icons';
import { useCallback, useMemo, useState } from 'react';
import { PartialData, Transaction } from '@/models';
import { useDataContext, useNotificationContext, useUserConfigContext } from '@/context';
import { toCurrency } from '@/utils/toCurrency';
import { EditableText } from '../EditableText';
import { ButtonDelete } from '../ButtonDelete';

import styles from '@/styles/Transaction.module.css';

const { Text } = Typography;

interface TransactionItemProps {
  transaction: Transaction;
}

const validateDate = (newDate: string) => {
  return !isNaN(Date.parse(newDate));
};

const validateAmount = (newAmount: string) => {
  return !isNaN(Number.parseFloat(newAmount));
};

const transactionUpdateWith = (key: keyof Transaction, value: any, transaction: Transaction): PartialData => {
  return {
    transactions: [{
      id: transaction.id,
      userId: transaction.userId,
      temporaryId: transaction.temporaryId,
      [key]: value,
    }]
  };
};

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const { locale, currency } = useUserConfigContext();
  const { updateData, deleteData } = useDataContext();
  const { setInfo } = useNotificationContext();
  const [isEditMode, setIsEditMode] = useState(false);
  const formattedAmount = useMemo(() => toCurrency(transaction.amount, locale, currency), [transaction.amount, locale, currency]);
  const formattedDate = useMemo(() => new Date(transaction.date).toLocaleDateString(), [transaction.date]);

  const handleItemClicked = useCallback(() => {
    if (transaction.isMergedTransaction) {
      setInfo('Cannot edit merged transactions!');
      return;
    }
    setIsEditMode(!isEditMode);
  }, [transaction, isEditMode, setIsEditMode, setInfo]);

  const handleDeleteConfirmed = useCallback(() => {
    deleteData({ transactions: [transaction.id ?? transaction.temporaryId] });
  }, [transaction.id, transaction.temporaryId, deleteData]);

  const handleDateChange = useCallback((newDate: string) => {
    if (transaction.isMergedTransaction) {
      setInfo('Cannot edit merged transactions!');
      return;
    }
    const date = new Date(newDate).toISOString();
    updateData(transactionUpdateWith('date', date, transaction));
  }, [transaction, updateData, setInfo]);

  const handleAmountChange = useCallback((newAmount: string) => {
    if (transaction.isMergedTransaction) {
      setInfo('Cannot edit merged transactions!');
      return;
    }
    const amount = Number.parseFloat(newAmount);
    updateData(transactionUpdateWith('amount', amount, transaction));
  }, [transaction, updateData, setInfo]);

  const handleDescriptionChange = useCallback((newDescription: string) => {
    updateData(transactionUpdateWith('description', newDescription, transaction));
  }, [transaction, updateData]);

  const itemStyles = transaction.isNew ? `${styles.transactionListItem} ${styles.transactionListItemNew}` : styles.transactionListItem;
  const tooltipTitle = transaction.recurringTransactionId ? `${transaction.description} (Recurring)` : transaction.description;
  return (
    <>
      <Tooltip placement="right" title={tooltipTitle}>
        <List.Item onClick={handleItemClicked}  className={itemStyles}>
          <div className={styles.transactionItem}>
            {transaction.recurringTransactionId && <div className={styles.recurringIcon}>
              <Text type="secondary"><FileSyncOutlined /></Text>
            </div>}
            <EditableText
              text={formattedDate}
              textProps={{ type: 'secondary' }}
              inputProps={{ style: { width: 80 }}}
              onEdit={handleDateChange}
              validate={validateDate}
              clearOnSelect
            />
            <EditableText
              text={formattedAmount}
              textProps={{ style: { textAlign: 'right' }}}
              inputProps={{ style: { width: 80, textAlign: 'right' }}}
              onEdit={handleAmountChange}
              validate={validateAmount}
              clearOnSelect
            />
          </div>
          {isEditMode &&
            <div className={styles.transactionItem}>
              <EditableText
                text={transaction.description}
                placeholder="No description"
                onEdit={handleDescriptionChange}
              />
              <ButtonDelete itemName="transaction" onConfirm={handleDeleteConfirmed} />
            </div>
          }
        </List.Item>
      </Tooltip>
    </>
  );
};
