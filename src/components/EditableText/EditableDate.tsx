import { withFallback } from '@/utils/stringUtils';
import { EditableText, EditableTextProps } from './EditableText';
import { toLocalDate } from '@/utils/dateUtils';
import { useCallback } from 'react';

export interface EditableDateProps extends Omit<EditableTextProps,  'text' | 'format'> {
  text?: string;
}

const validateDate = (newDate: string) => {
  return !isNaN(Date.parse(newDate));
};

const EditableDate = ({ text, onEdit, ...rest}: EditableDateProps) => {
  const handleEdit = useCallback((text: string) => {
    onEdit(new Date(text).toISOString());
  }, [onEdit]);
  return (
    <EditableText
      text={withFallback(text)}
      onEdit={handleEdit}
      validate={validateDate}
      format={toLocalDate}
      clearOnSelect
      inputProps={{ style: { width: 55 }}}
      {...rest}
    />
  );
};

export default EditableDate;