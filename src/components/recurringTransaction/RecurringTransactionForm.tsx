import { Form, FormProps, Input, InputNumber } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useUserConfigContext } from '@/context';
import { RecurringTransaction } from '@/models';
import { Interval } from '@/models/IntervalModel';
import { IntervalFormPart } from '../form/IntervalFormPart';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export const RecurringTransactionForm = ({ ...formProps }: FormProps) => {
  const { currency } = useUserConfigContext();
  const [isLimit, setIsLimit] = useState(false);
  const initialValues = formProps.initialValues as RecurringTransaction;
  const [intervalSuffix, setIntervalSuffix] = useState(Interval[initialValues.intervalType]?.plural ?? Interval.daily.plural);

  useEffect(() => {
    const initialValues = formProps.initialValues as RecurringTransaction;
    if (initialValues.intervalType) {
      setIntervalSuffix(Interval[initialValues?.intervalType]?.plural);
    }
    if (initialValues.isLimited !== undefined) {
      setIsLimit(initialValues.isLimited);
    }
  }, [formProps.initialValues, setIntervalSuffix, setIsLimit]);

  const handleValuesChange = useCallback((changedValues: Partial<RecurringTransaction>) => {
    if (changedValues.intervalType !== undefined) {
      setIntervalSuffix(Interval[changedValues.intervalType].plural);
    }
    if (changedValues.isLimited !== undefined) {
      setIsLimit(changedValues.isLimited);
    }
  }, [setIntervalSuffix]);

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
        <Input.TextArea placeholder="Description" />
      </Form.Item>
      <IntervalFormPart intervalSuffix={intervalSuffix} isLimit={isLimit} />
    </Form>
  );
};
