import { Button, Drawer, Space } from 'antd';

interface RecurringItemDrawerProps {
  itemName: string;
  isOpen: boolean;
  children: React.ReactNode;
  onClose(): void;
}

export const RecurringItemDrawer = ({ itemName, isOpen, onClose, children }: RecurringItemDrawerProps) => {
  return (
    <Drawer
      title={`Create recurring ${itemName}`}
      width={800}
      onClose={onClose}
      open={isOpen}
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onClose} type="primary">
            Submit
          </Button>
        </Space>
      }
    >
      {children}
    </Drawer>
  );
};
