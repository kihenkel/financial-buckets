import { RecurringAdjustment, RecurringTransaction } from '@/models';
import { Button, Drawer, Form, FormProps, Space } from 'antd';
import { useCallback, useEffect } from 'react';

interface RecurringItemDrawerProps {
  itemName: string;
  isOpen: boolean;
  formComponent: React.FC<FormProps>;
  existingData?: RecurringAdjustment | RecurringTransaction;
  onFinish(values: any): void;
  onClose(): void;
}

export const RecurringItemDrawer = ({ itemName, isOpen, formComponent: FormComponent, existingData, onFinish, onClose }: RecurringItemDrawerProps) => {
  const [form] = Form.useForm();

  const handleSubmit = useCallback(() => {
    form.submit();
  }, [form]);

  useEffect(() => {
    form.resetFields();
  }, [form, existingData]);

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
          <Button onClick={handleSubmit} type="primary">
            Submit
          </Button>
        </Space>
      }
    >
      <FormComponent form={form} onFinish={onFinish} initialValues={existingData} />
    </Drawer>
  );
};
