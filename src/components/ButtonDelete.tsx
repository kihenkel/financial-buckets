import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { MouseEvent, useCallback, useState } from 'react';

interface ButtonDeleteProps {
  itemName: string;
  onConfirm(): void;
}

export const ButtonDelete = ({ itemName, onConfirm }: ButtonDeleteProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleConfirmed = useCallback(() => {
    onConfirm();
    setIsConfirmOpen(false);
  }, [setIsConfirmOpen, onConfirm]);

  const handleClicked = useCallback((e: MouseEvent | undefined) => {
    e?.stopPropagation();
    setIsConfirmOpen(!isConfirmOpen);
  }, [isConfirmOpen, setIsConfirmOpen]);

  return (
    <Popconfirm
      title={`Delete ${itemName}`}
      description={`Are you sure you want to delete this ${itemName}?`}
      onConfirm={handleConfirmed}
      onCancel={handleClicked}
      open={isConfirmOpen}
      okText="Yes"
      cancelText="No"
    >
      <Button onClick={handleClicked} size="small" type="text"><DeleteOutlined /></Button>
    </Popconfirm>
    );
};
