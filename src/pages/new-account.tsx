import { useCallback } from 'react';
import { Button, Form, Typography } from 'antd';
import { useRouter } from 'next/router';
import { AccountCycle } from '@/models';
import { useDataContext, useUserContext } from '@/context';
import { FormFieldSelect, FormFieldText } from '@/components/form';

import styles from '@/styles/NewAccountPage.module.css';

const { Title } = Typography;

const formLayout = {
  labelCol: { span: 64 },
  wrapperCol: { span: 64 },
};

const cycleOptions: { label: string; value: AccountCycle }[] = [{
  label: 'Weekly',
  value: 'weekly',
}, {
  label: 'Biweekly',
  value: 'biweekly',
}, {
  label: 'Semimonthly',
  value: 'semimonthly',
}, {
  label: 'Monthly',
  value: 'monthly',
}];

export default function NewAccountPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { user } = useUserContext();
  const { updateData } = useDataContext();

  const handleSubmit = useCallback((formData: any) => {
    const submitData = {
      accounts: [{
        userId: user?.id,
        name: formData.accountName,
        cycle: formData.accountCycle,
        balance: 0,
      }]
    };
    updateData(submitData, true);
    setTimeout(() => router.push('/'), 0);
  }, [user, router, updateData]);

  return (
    <div className={styles.page}>
      <Title>Add new account</Title>
      <Form
        {...formLayout}
        form={form}
        name="newAccount-form"
        layout="vertical"
        onFinish={handleSubmit}
      >
        <FormFieldText label="Name of the new account?" name="accountName" required />
        <FormFieldSelect label="Account financial cycle?" name="accountCycle" options={cycleOptions} required />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
