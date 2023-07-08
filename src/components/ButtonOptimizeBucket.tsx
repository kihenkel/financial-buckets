import { Button, Popconfirm } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import { MouseEvent, useCallback, useState } from 'react';

interface ButtonOptimizeBucketProps {
  onConfirm(): void;
}

export const ButtonOptimizeBucket = ({ onConfirm }: ButtonOptimizeBucketProps) => {
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
      title={'Optimize Bucket'}
      description={'Are you sure you want to optimize this bucket?'}
      onConfirm={handleConfirmed}
      onCancel={handleClicked}
      open={isConfirmOpen}
      okText="Yes"
      cancelText="No"
    >
      <Button onClick={handleClicked} size="small" type="text"><DashboardOutlined /></Button>
    </Popconfirm>
    );
};
