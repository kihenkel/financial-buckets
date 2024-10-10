import React from 'react';
import { Input, InputNumber, Form, Select, DatePicker } from 'antd';

const { Option } = Select;

interface FormFieldTextProps {
  name: string;
  label: string;
  required?: boolean;
}

export const FormFieldText = ({ name, label, required }: FormFieldTextProps) => {
  return (
    <Form.Item name={name} label={label} rules={[{ required }]}>
      <Input />
    </Form.Item>
  );
};

export const FormFieldNumber = ({ name, label, required }: FormFieldTextProps) => {
  return (
    <Form.Item name={name} label={label} rules={[{ required }]}>
      <InputNumber />
    </Form.Item>
  );
};

export const FormFieldPercentage = ({ name, label, required }: FormFieldTextProps) => {
  return (
    <Form.Item name={name} label={label} rules={[{ required }]}>
      <InputNumber<number> min={0} formatter={(value) => `${(value ?? 0) * 100}%`} parser={(value) => parseFloat(value?.replace('%', '') ?? '0') / 100} step={0.1} />
    </Form.Item>
  );
};

export const FormFieldDate = ({ name, label, required }: FormFieldTextProps) => {
  return (
    <Form.Item name={name} label={label} rules={[{ required }]}>
      <DatePicker />
    </Form.Item>
  );
};

interface FormFieldSelectProps extends FormFieldTextProps {
  options: {
    label: string;
    value: string;
  }[];
}

export const FormFieldSelect = ({ name, label, options, required }: FormFieldSelectProps) => {
  return (
    <Form.Item name={name} label={label} rules={[{ required }]}>
      <Select placeholder="Select an option">
        {options.map(({ label, value }) => {
          return <Option key={value} value={value}>{label}</Option>;
        })}
      </Select>
    </Form.Item>
  );
};
