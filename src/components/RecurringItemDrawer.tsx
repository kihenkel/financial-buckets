import { Button, Drawer, Space } from 'antd';

interface RecurringItemDrawerProps {
  itemName: string;
  children: React.ReactNode;
  onClose(): void;
}

export const RecurringItemDrawer = ({ itemName, onClose, children }: RecurringItemDrawerProps) => {
  return (
    <Drawer
      title={`Create recurring ${itemName}`}
      width={450}
      onClose={onClose}
      open
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
