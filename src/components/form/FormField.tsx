import React from 'react';
import { Input, Form, Select } from 'antd';

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
