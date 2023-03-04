import { List, Tooltip } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { PartialData, Transaction } from '@/models';
import { useDataContext, useNotificationContext, useUserConfigContext } from '@/context';
import { toCurrency } from '@/utils/toCurrency';

import styles from '@/styles/Transaction.module.css';
import { EditableText } from '../EditableText';
import { ButtonDelete } from '../ButtonDelete';

interface TransactionItemProps {
  transaction: Transaction;
}

const SAVE_WARNING_MESSAGE = 'Unable to update item, please save your data first!';

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
      [key]: value,
    }]
  };
};

export const TransactionItem = ({ transaction }: TransactionItemProps) => {
  const { locale, currency } = useUserConfigContext();
  const { updateData, deleteData } = useDataContext();
  const [isEditMode, setIsEditMode] = useState(false);
  const { setWarning } = useNotificationContext();
  const formattedAmount = useMemo(() => toCurrency(transaction.amount, locale, currency), [transaction.amount, locale, currency]);
  const formattedDate = useMemo(() => new Date(transaction.date).toLocaleDateString(), [transaction.date]);

  const handleItemClicked = useCallback(() => {
    setIsEditMode(!isEditMode);
  }, [isEditMode, setIsEditMode]);

  const tryExecute = useCallback((itemId: string, handler: () => any) => {
    if (itemId) {
      handler();
    } else {
      setWarning(SAVE_WARNING_MESSAGE);
    }
  }, [setWarning]);

  const handleDeleteConfirmed = useCallback(() => {
    tryExecute(transaction.id, () => deleteData({ transactions: [transaction.id] }));
  }, [transaction.id, deleteData, tryExecute]);

  const handleDateChange = useCallback((newDate: string) => {
    const date = new Date(newDate).toISOString();
    tryExecute(transaction.id, () => updateData(transactionUpdateWith('date', date, transaction)));
  }, [transaction, updateData, tryExecute]);

  const handleAmountChange = useCallback((newAmount: string) => {
    const amount = Number.parseFloat(newAmount);
    tryExecute(transaction.id, () => updateData(transactionUpdateWith('amount', amount, transaction)));
  }, [transaction, updateData, tryExecute]);

  const handleDescriptionChange = useCallback((newDescription: string) => {
    tryExecute(transaction.id, () => updateData(transactionUpdateWith('description', newDescription, transaction)));
  }, [transaction, updateData, tryExecute]);

  const itemStyles = transaction.isNew ? `${styles.transactionListItem} ${styles.transactionListItemNew}` : styles.transactionListItem;
  return (
    <>
      <Tooltip placement="right" title={transaction.description}>
        <List.Item onClick={handleItemClicked}  className={itemStyles}>
          <div className={styles.transactionItem}>
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
