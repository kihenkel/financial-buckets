
import { Alert, DatePicker, Form, InputNumber, Select, Space, Switch, TimePicker } from 'antd';
import dayjs from 'dayjs';
import { Interval, Intervals } from '@/models';
import { RecurringAdjustment, RecurringTransaction } from '@/models';
import { useEffect, useState } from 'react';
import { calculateOccurences } from '@/utils/calculateOccurences';
import { useUserConfigContext } from '@/context';

const { Option } = Select;

const MAX_NEXT_OCCURENCES: number = 5;
const localeStringOptions: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
};

interface IntervalFormPartProps {
  initialValues: Partial<RecurringTransaction | RecurringAdjustment>;
  changedValues: Partial<RecurringTransaction | RecurringAdjustment>;
}

export const IntervalFormPart = ({ initialValues, changedValues }: IntervalFormPartProps) => {
  const form = Form.useFormInstance();
  const { locale } = useUserConfigContext();
  const [isLimit, setIsLimit] = useState(false);
  const [intervalSuffix, setIntervalSuffix] = useState(initialValues.intervalType ? Interval[initialValues.intervalType]?.plural : Interval.daily.plural);

  useEffect(() => {
    setIntervalSuffix(initialValues.intervalType ? Interval[initialValues.intervalType]?.plural : Interval.daily.plural);
    if (initialValues.isLimited !== undefined) {
      setIsLimit(initialValues.isLimited);
    }
  }, [initialValues]);

  useEffect(() => {
    if (changedValues.intervalType !== undefined) {
      setIntervalSuffix(Interval[changedValues.intervalType].plural);
    }
    if (changedValues.isLimited !== undefined) {
      setIsLimit(changedValues.isLimited);
    }
  }, [changedValues]);

  const interval = Form.useWatch('interval', form);
  const initialDate = Form.useWatch('initialDate', form);
  const amountLeft = Form.useWatch('amountLeft', form);
  const intervalType = Form.useWatch('intervalType', form);
  const nextOccurences = calculateOccurences({ interval, initialDate, calculateStartDate: Date.now(), limit: Math.min(amountLeft ?? MAX_NEXT_OCCURENCES, MAX_NEXT_OCCURENCES), intervalType });
  const displayNextOccurences = nextOccurences ? nextOccurences.map((occurence) => new Date(occurence).toLocaleString(locale, localeStringOptions)) : 'Please enter valid interval';

  const isSemiMonthly = intervalType === 'semiMonthly';
  return (
    <>
      <Form.Item name="intervalType" label="Interval" initialValue={Intervals[0][0]}>
        <Select>
          {Intervals.map(([key, interval]) => (
            <Option key={key} value={key}>{interval.label}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="interval"
        label={`Every ${intervalSuffix}`}
        hidden={!intervalSuffix}
        rules={[({ getFieldValue }) => ({
          validator(_, value) {
            if (value > 0 || getFieldValue('intervalType') === 'semiMonthly') {
              return Promise.resolve();
            }
            return Promise.reject(new Error('Please enter interval'));
          },
        })]}
      >
        <InputNumber min={1} controls={false} />
      </Form.Item>
      <Form.Item
        name="initialDate"
        label={isSemiMonthly ? 'Time' : 'First occurence'}
        rules={[({ getFieldValue }) => ({
          validator(_, value) {
            if (value || getFieldValue('intervalType') === 'semiMonthly') {
              return Promise.resolve();
            }
            return Promise.reject(new Error('Please enter date'));
          },
        })]}
      >
        {isSemiMonthly ? (
          <TimePicker
            placement="bottomRight"
            format="HH:mm"
            minuteStep={10}
          />
        ) : (
          <DatePicker
            placement="bottomRight"
            showTime={{ defaultValue: dayjs('06:00:00', 'HH:mm:ss') }}
          />
        )}
      </Form.Item>
      <Form.Item
        name="isLimited"
        label="Limit occurences?"
        initialValue={false}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
      <Form.Item
        name="amountLeft"
        label="Limit"
        rules={[({ getFieldValue }) => ({
          validator(_, value) {
            if (value > 0 || !getFieldValue('isLimited')) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('Please enter valid limit'));
          },
        })]}
        hidden={isLimit === false}
      >
        <InputNumber min={1} controls={false} />
      </Form.Item>
      <Alert message="Next occurences:" description={<Space direction="vertical">{displayNextOccurences}</Space>} type="info" />
    </>
  );
};
