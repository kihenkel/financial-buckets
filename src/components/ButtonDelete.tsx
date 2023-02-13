import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { MouseEvent, useCallback, useState } from 'react';

interface TransactionItemProps {
  itemName: string;
  onConfirm(): void;
}

export const ButtonDelete = ({ itemName, onConfirm }: TransactionItemProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteConfirmed = useCallback(() => {
    onConfirm();
    setIsConfirmOpen(false);
  }, [setIsConfirmOpen, onConfirm]);

  const handleDeleteClicked = useCallback((e: MouseEvent | undefined) => {
    e?.stopPropagation();
    setIsConfirmOpen(!isConfirmOpen);
  }, [isConfirmOpen, setIsConfirmOpen]);

  return (
    <Popconfirm
      title={`Delete ${itemName}`}
      description={`Are you sure you want to delete this ${itemName}?`}
      onConfirm={handleDeleteConfirmed}
      onCancel={handleDeleteClicked}
      open={isConfirmOpen}
      okText="Yes"
      cancelText="No"
    >
      <Button onClick={handleDeleteClicked} size="small" type="text"><DeleteOutlined /></Button>
    </Popconfirm>
    );
};
