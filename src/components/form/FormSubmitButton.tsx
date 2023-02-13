import { Button } from 'antd';

interface FormSubmitButtonProps {
  label?: string;
}

export const FormSubmitButton = ({ label }: FormSubmitButtonProps) => {
  return (
    <Button type="primary" htmlType="submit">
      Next
    </Button>
  );
};
