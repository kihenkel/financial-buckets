
import { DatePicker, Form, InputNumber, Select, Space, Switch } from 'antd';
import dayjs from 'dayjs';
import { Intervals } from '@/models/IntervalModel';

const { Option } = Select;

interface IntervalFormPartProps {
  intervalSuffix: string;
  isLimit: boolean;
}

export const IntervalFormPart = ({ intervalSuffix, isLimit }: IntervalFormPartProps) => {
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
        name="date"
        label="First occurence"
        hidden={!intervalSuffix}
        rules={[({ getFieldValue }) => ({
          validator(_, value) {
            if (value || getFieldValue('intervalType') === 'semiMonthly') {
              return Promise.resolve();
            }
            return Promise.reject(new Error('Please enter date'));
          },
        })]}
      >
        <DatePicker placement="bottomRight" showTime={{ defaultValue: dayjs('06:00:00', 'HH:mm:ss') }} />
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
        hidden={!isLimit}
      >
        <InputNumber min={1} controls={false} />
      </Form.Item>
    </>
  );
};
