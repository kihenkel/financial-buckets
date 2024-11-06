import { Button, Popconfirm } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { MouseEvent, useCallback, useState } from 'react';

interface ButtonArchiveProps {
  onConfirm(): void;
}

export const ButtonArchive = ({ onConfirm }: ButtonArchiveProps) => {
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
      title="Archive"
      description={'Are you sure you want to archive this bucket?'}
      onConfirm={handleConfirmed}
      onCancel={handleClicked}
      open={isConfirmOpen}
      okText="Yes"
      cancelText="No"
    >
      <Button onClick={handleClicked} size="small" type="text"><InboxOutlined /></Button>
    </Popconfirm>
    );
};
