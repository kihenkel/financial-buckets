import { useUserConfigContext } from '@/context';
import { Form, FormProps, Input, InputNumber } from 'antd';

interface RecurringAdjustmentFormProps extends FormProps {
}

export const RecurringAdjustmentForm = ({ ...formProps }: RecurringAdjustmentFormProps) => {
  const { currency } = useUserConfigContext();
  return (
    <Form layout="vertical" requiredMark={false} {...formProps}>
      <Form.Item
        name="label"
        label="Enter name for adjustment"
        rules={[{ required: true, message: 'Please enter label' }]}
      >
        <Input placeholder="Label" />
      </Form.Item>
      <Form.Item
        name="amount"
        label="Amount"
        rules={[{ required: true, message: 'Please enter amount' }]}
      >
        <InputNumber placeholder={currency} controls={false} />
      </Form.Item>
      <Form.Item
        name="dayOfMonth"
        label="Which day of the month should the adjustment happen? (1-31)"
        rules={[{ required: true, message: 'Please enter day of month' }]}
      >
        <InputNumber min={1} max={31} placeholder="Day" controls={false} />
      </Form.Item>
      <Form.Item
        name="description"
        label="Enter descripton"
      >
        <Input.TextArea placeholder="Description" />
      </Form.Item>
    </Form>
  );
};
