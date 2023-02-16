import { List } from 'antd';
import { RecurringAdjustment } from '@/models';

interface RecurringAdjustmentItemProps {
  recurringAdjustment: RecurringAdjustment;
}

export const RecurringAdjustmentItem = ({ recurringAdjustment }: RecurringAdjustmentItemProps) => {
  // const { locale, currency } = useUserConfigContext();
  // const { updateData, deleteData } = useDataContext();
  // const [isEditMode, setIsEditMode] = useState(false);
  // const formattedAmount = useMemo(() => toCurrency(recurringAdjustment.amount, locale, currency), [recurringAdjustment.amount, locale, currency]);

  // const handleItemClicked = useCallback(() => {
  //   setIsEditMode(!isEditMode);
  // }, [isEditMode, setIsEditMode]);

  // const handleDeleteConfirmed = useCallback(() => {
  //   deleteData({
  //     recurringAdjustments: [recurringAdjustment.id]
  //   });
  // }, [recurringAdjustment.id, deleteData]);

  // const handleLabelChange = useCallback((newLabel: string) => {
  //   updateData(recurringAdjustmentUpdateWith('label', newLabel, recurringAdjustment));
  // }, [recurringAdjustment, updateData]);

  // const handleAmountChange = useCallback((newAmount: string) => {
  //   const amount = Number.parseFloat(newAmount);
  //   updateData(recurringAdjustmentUpdateWith('amount', amount, recurringAdjustment));
  // }, [recurringAdjustment, updateData]);

  // const handleDescriptionChange = useCallback((newDescription: string) => {
  //   updateData(recurringAdjustmentUpdateWith('description', newDescription, recurringAdjustment));
  // }, [recurringAdjustment, updateData]);

  return (
    <List.Item>
      <List.Item.Meta
        title={recurringAdjustment.label}
        description={recurringAdjustment.description}
      />
    </List.Item>
  );
};
