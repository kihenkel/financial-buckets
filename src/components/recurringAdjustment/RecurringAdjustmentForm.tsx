import { useUserConfigContext } from '@/context';
import { DatePicker, Form, Input, InputNumber, Select } from 'antd';

const { Option } = Select;

const intervalTypes = [
  { value: 'daily', label: 'Daily'},
  { value: 'weekly', label: 'Weekly'},
  { value: 'monthly', label: 'Monthly'},
  { value: 'yearly', label: 'Yearly'},
  { value: 'semiMonthly', label: 'Semi-monthly (1st and 15th)'},
];

export const RecurringAdjustmentForm = () => {
  const { currency } = useUserConfigContext();
  return (
    <Form layout="vertical" requiredMark={false}>
      <Form.Item
        name="amount"
        label="Amount"
        rules={[{ required: true, message: 'Please enter amount' }]}
      >
        <InputNumber placeholder={currency} />
      </Form.Item>
      <Form.Item
        name="intervalType"
        label="Interval Type"
        rules={[{ required: true, message: 'Please select interval type' }]}
      >
        <Select placeholder="Select interval type">
          {intervalTypes.map((intervalType) => (
            <Option key={intervalType.value} value={intervalType.value}>{intervalType.label}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="interval"
        label="Interval (every X days/weeks/months/years)"
        rules={[{ required: true, message: 'Please enter interval' }]}
      >
        <InputNumber placeholder="Interval" />
      </Form.Item>
      <Form.Item
        name="date"
        label="First transaction date"
        rules={[{ required: true, message: 'Please enter date' }]}
      >
        <DatePicker />
      </Form.Item>
      <Form.Item
        name="transactionsLeft"
        label="Limit transactions"
      >
        <InputNumber placeholder="Amount" defaultValue={-1} />
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
      >
        <Input placeholder="Description" />
      </Form.Item>
    </Form>
  );
};
