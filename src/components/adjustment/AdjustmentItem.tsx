import { message, List, Tooltip } from 'antd';
import { useCallback, useMemo, useState } from 'react';
import { PartialData, Adjustment } from '@/models';
import { useDataContext, useNotificationContext, useUserConfigContext } from '@/context';
import { toCurrency } from '@/utils/toCurrency';

import { EditableText } from '../EditableText';
import { ButtonDelete } from '../ButtonDelete';

import styles from '@/styles/Adjustment.module.css';

interface AdjustmentItemProps {
  adjustment: Adjustment;
}

const SAVE_WARNING_MESSAGE = 'Unable to update item, please save your data first!';

const validateAmount = (newAmount: string) => {
  return !isNaN(Number.parseFloat(newAmount));
};

const adjustmentUpdateWith = (key: keyof Adjustment, value: any, adjustment: Adjustment): PartialData => {
  return {
    adjustments: [{
      id: adjustment.id,
      userId: adjustment.userId,
      [key]: value,
    }]
  };
};

export const AdjustmentItem = ({ adjustment }: AdjustmentItemProps) => {
  const { locale, currency } = useUserConfigContext();
  const { setWarning } = useNotificationContext();
  const { updateData, deleteData } = useDataContext();
  const [isEditMode, setIsEditMode] = useState(false);
  const formattedAmount = useMemo(() => toCurrency(adjustment.amount, locale, currency), [adjustment.amount, locale, currency]);

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
    tryExecute(adjustment.id, () => deleteData({ adjustments: [adjustment.id] }));
  }, [adjustment.id, deleteData, tryExecute]);

  const handleLabelChange = useCallback((newLabel: string) => {
    tryExecute(adjustment.id, () => updateData(adjustmentUpdateWith('label', newLabel, adjustment)));
  }, [adjustment, updateData, tryExecute]);

  const handleAmountChange = useCallback((newAmount: string) => {
    const amount = Number.parseFloat(newAmount);
    tryExecute(adjustment.id, () => updateData(adjustmentUpdateWith('amount', amount, adjustment)));
  }, [adjustment, updateData, tryExecute]);

  const handleDescriptionChange = useCallback((newDescription: string) => {
    tryExecute(adjustment.id, () => updateData(adjustmentUpdateWith('description', newDescription, adjustment)));
  }, [adjustment, updateData, tryExecute]);

  const itemStyles = adjustment.isNew ? `${styles.adjustmentListItem} ${styles.adjustmentListItemNew}` : styles.adjustmentListItem;
  return (
    <>
      <Tooltip placement="right" title={adjustment.description}>
        <List.Item onClick={handleItemClicked} className={itemStyles}>
          <div className={styles.adjustmentItem}>
            <EditableText
              text={adjustment.label}
              textProps={{ type: 'secondary' }}
              inputProps={{ style: { width: 80 }}}
              onEdit={handleLabelChange}
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
            <div className={styles.adjustmentItem}>
              <EditableText
                text={adjustment.description}
                placeholder="No description"
                onEdit={handleDescriptionChange}
              />
              <ButtonDelete itemName="adjustment" onConfirm={handleDeleteConfirmed} />
            </div>
          }
        </List.Item>
      </Tooltip>
    </>
  );
};
