import { parsePercentage, withFallback } from '@/utils/stringUtils';
import { EditableText, EditableTextProps } from './EditableText';
import { toPercentage } from '@/utils/numberUtils';
import { useUserConfigContext } from '@/context';
import { useCallback } from 'react';

export interface EditablePercentageProps extends Omit<EditableTextProps, 'onEdit' | 'text' | 'format'> {
  text?: string | number;
  onEdit(rate: number): void;
}

const validatePercentage = (val: string) => {
  return !isNaN(Number.parseFloat(val));
};

const EditablePercentage = ({ text, onEdit, ...rest}: EditablePercentageProps) => {
  const { locale } = useUserConfigContext();
  const handleEdit = useCallback((text: string) => {
    onEdit(parsePercentage(text));
  }, [onEdit]);
  return (
    <EditableText
      text={withFallback(text)}
      onEdit={handleEdit}
      format={(value) => toPercentage(value, locale)}
      validate={validatePercentage}
      clearOnSelect
      {...rest}
    />
  );
};

export default EditablePercentage;