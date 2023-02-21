import { RecurringAdjustment, RecurringTransaction } from '@/models';
import { Button, Drawer, Form, FormProps, Space } from 'antd';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo } from 'react';

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

  const handleOnFinish = useCallback((data: any) => {
    if (data.initialDate) {
      data.initialDate = data.initialDate.format(); // dayjs object
    }
    onFinish(data);
  }, [onFinish]);

  const handleSubmit = useCallback(() => {
    form.submit();
  }, [form]);

  const handleClose = useCallback(() => {
    form.resetFields();
    onClose();
  }, [form, onClose]);

  const initialValues = useMemo(() => {
    const values = { ...existingData } as any;
    if (values?.initialDate) {
      values.initialDate = dayjs(values.initialDate);
    }
    return values;
  }, [existingData]);

  useEffect(() => {
    form.resetFields();
  }, [form, existingData]);

  return ( 
    <Drawer
      title={`Create recurring ${itemName}`}
      width={600}
      onClose={handleClose}
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
      <FormComponent form={form} onFinish={handleOnFinish} initialValues={initialValues} />
    </Drawer>
  );
};
