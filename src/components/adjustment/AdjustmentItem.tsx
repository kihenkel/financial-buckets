import { List, Tooltip, Typography } from 'antd';
import { FileSyncOutlined } from '@ant-design/icons';
import { useCallback, useMemo, useState } from 'react';
import { PartialData, Adjustment } from '@/models';
import { useDataContext, useUserConfigContext } from '@/context';
import { toCurrency } from '@/utils/toCurrency';

import { EditableText } from '../EditableText/EditableText';
import { ButtonDelete } from '../ButtonDelete';

import styles from '@/styles/Adjustment.module.css';

const { Text } = Typography;


interface AdjustmentItemProps {
  adjustment: Adjustment;
}

const validateAmount = (newAmount: string) => {
  return !isNaN(Number.parseFloat(newAmount));
};

const adjustmentUpdateWith = (key: keyof Adjustment, value: any, adjustment: Adjustment): PartialData => {
  return {
    adjustments: [{
      id: adjustment.id,
      userId: adjustment.userId,
      temporaryId: adjustment.temporaryId,
      [key]: value,
    }]
  };
};

export const AdjustmentItem = ({ adjustment }: AdjustmentItemProps) => {
  const { locale, currency } = useUserConfigContext();
  const { updateData, deleteData } = useDataContext();
  const [isEditMode, setIsEditMode] = useState(false);
  const formattedAmount = useMemo(() => toCurrency(adjustment.amount, locale, currency), [adjustment.amount, locale, currency]);

  const handleItemClicked = useCallback(() => {
    setIsEditMode(!isEditMode);
  }, [isEditMode, setIsEditMode]);

  const handleDeleteConfirmed = useCallback(() => {
    deleteData({ adjustments: [adjustment.id ?? adjustment.temporaryId] });
  }, [adjustment.id, adjustment.temporaryId, deleteData]);

  const handleLabelChange = useCallback((newLabel: string) => {
    updateData(adjustmentUpdateWith('label', newLabel, adjustment));
  }, [adjustment, updateData]);

  const handleAmountChange = useCallback((newAmount: string) => {
    const amount = Number.parseFloat(newAmount);
    updateData(adjustmentUpdateWith('amount', amount, adjustment));
  }, [adjustment, updateData]);

  const handleDescriptionChange = useCallback((newDescription: string) => {
    updateData(adjustmentUpdateWith('description', newDescription, adjustment));
  }, [adjustment, updateData]);

  const itemStyles = adjustment.isNew ? `${styles.adjustmentListItem} ${styles.adjustmentListItemNew}` : styles.adjustmentListItem;
  const tooltipTitle = adjustment.recurringAdjustmentId ? (adjustment.description ? `${adjustment.description} (Recurring)` : 'Recurring Item') : adjustment.description;
  return (
    <>
      <Tooltip placement="right" title={tooltipTitle}>
        <List.Item onClick={handleItemClicked} className={itemStyles}>
          <div className={styles.adjustmentItem}>
            {adjustment.recurringAdjustmentId && <div className={styles.recurringIcon}>
              <Text type="secondary"><FileSyncOutlined /></Text>
            </div>}
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
