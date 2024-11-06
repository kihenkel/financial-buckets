import { N_A } from '@/utils/stringUtils';
import { Input, InputProps, Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import { EventHandler,  MouseEvent,  useCallback, useMemo, useState } from 'react';

const { Text }= Typography;

export interface EditableTextProps {
  text: string;
  placeholder?: string;
  textProps?: TextProps;
  inputProps?: InputProps;
  clearOnSelect?: boolean;
  allowEmpty?: boolean;
  onEdit(newText: string): void;
  validate?(input: string): boolean;
  format?(value: string): string;
}

export const EditableText = ({ text, placeholder, textProps, inputProps, clearOnSelect, allowEmpty, onEdit, validate, format }: EditableTextProps) => {
  const [isEditMode, setIsEditMode] = useState(!text);

  const handleTextClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
    setIsEditMode(true);
  }, [setIsEditMode]);

  const handleInputClick = useCallback((e: MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleInputFinish = useCallback<EventHandler<any>>((event) => {
    const newText = String(event.target.value);
    setIsEditMode(false);
    if ((newText || allowEmpty) && newText !== text && (!validate || validate(newText))) {
      onEdit(newText);
    }
  }, [text, allowEmpty, onEdit, setIsEditMode, validate]);

  const formattedText = useMemo(() => format && text !== N_A ? format(text) : text, [format, text]);
  return (
    <>
      {!isEditMode && <Text {...textProps} onClick={handleTextClick} style={{ cursor: 'text', ...textProps?.style }}>{formattedText}</Text>}
      {isEditMode &&
        <Input
          autoFocus={!!text}
          placeholder={format && text && text !== N_A ? format(text) : (text || placeholder)}
          defaultValue={clearOnSelect ? undefined : text}
          variant="borderless"
          size="small"
          {...inputProps}
          style={{ padding: 0, ...inputProps?.style }}
          onPressEnter={handleInputFinish}
          onBlur={handleInputFinish}
          onClick={handleInputClick}
        />
      }
    </>
  );
};
