import { Input, InputProps, Typography } from 'antd';
import { TextProps } from 'antd/es/typography/Text';
import { EventHandler,  MouseEvent,  useCallback, useState } from 'react';

const { Text }= Typography;

interface EditableTextProps {
  text: string;
  placeholder?: string;
  textProps?: TextProps;
  inputProps?: InputProps;
  clearOnSelect?: boolean;
  allowEmpty?: boolean;
  onEdit(newText: string): void;
  validate?(input: string): boolean;
}

export const EditableText = ({ text, placeholder, textProps, inputProps, clearOnSelect, allowEmpty, onEdit, validate }: EditableTextProps) => {
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
  return (
    <>
      {!isEditMode && <Text {...textProps} onClick={handleTextClick} style={{ cursor: 'text', ...textProps?.style }}>{text}</Text>}
      {isEditMode &&
        <Input
          autoFocus={!!text}
          placeholder={text || placeholder}
          defaultValue={clearOnSelect ? undefined : text}
          bordered={false}
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
