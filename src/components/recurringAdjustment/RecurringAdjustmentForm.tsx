
import { Form, FormProps, Input, InputNumber } from 'antd';
import { useCallback, useState } from 'react';
import { useUserConfigContext } from '@/context';
import { RecurringAdjustment } from '@/models';
import { IntervalFormPart } from '../form/IntervalFormPart';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export const RecurringAdjustmentForm = ({ ...formProps }: FormProps) => {
  const { currency } = useUserConfigContext();
  const [changedValues, setChangedValues] = useState<Partial<RecurringAdjustment>>({});

  const handleValuesChange = useCallback((changedValues: Partial<RecurringAdjustment>) => {
    setChangedValues(changedValues);
  }, [setChangedValues]);

  return (
    <Form requiredMark={false} onValuesChange={handleValuesChange} {...formItemLayout} {...formProps}>
      <Form.Item
        name="label"
        label="Adjustment name"
        rules={[{ required: true }]}
      >
        <Input placeholder="Label" />
      </Form.Item>
      <Form.Item
        name="amount"
        label="Amount"
        rules={[{ required: true }]}
      >
        <InputNumber placeholder={currency} controls={false} />
      </Form.Item>
      <Form.Item name="description" label="Enter descripton">
        <Input.TextArea placeholder="Description" />
      </Form.Item>
      <IntervalFormPart
        initialValues={formProps.initialValues as Partial<RecurringAdjustment>}
        changedValues={changedValues}
        considerBankHolidays={true}
      />
    </Form>
  );
};
