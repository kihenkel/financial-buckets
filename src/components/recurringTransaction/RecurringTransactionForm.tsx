import { Form, FormProps, Input, InputNumber } from 'antd';
import { useCallback, useState } from 'react';
import { useUserConfigContext } from '@/context';
import { RecurringTransaction } from '@/models';
import { IntervalFormPart } from '../form/IntervalFormPart';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export const RecurringTransactionForm = ({ ...formProps }: FormProps) => {
  const { currency } = useUserConfigContext();
  const [changedValues, setChangedValues] = useState<Partial<RecurringTransaction>>({});

  const handleValuesChange = useCallback((changedValues: Partial<RecurringTransaction>) => {
    setChangedValues({ ...changedValues });
  }, [setChangedValues]);

  return (
    <Form requiredMark={false} onValuesChange={handleValuesChange} {...formItemLayout} {...formProps}>
      <Form.Item
        name="amount"
        label="Amount"
        rules={[{ required: true }]}
      >
        <InputNumber placeholder={currency} controls={false} />
      </Form.Item>
      <Form.Item name="description" label="Enter descripton">
        <Input.TextArea placeholder="Description (Tip: Use %c as counter)" />
      </Form.Item>
      <IntervalFormPart
        initialValues={formProps.initialValues as Partial<RecurringTransaction>}
        changedValues={changedValues}
      />
    </Form>
  );
};
