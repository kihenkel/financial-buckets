import { useCallback } from 'react';
import { Button, Form } from 'antd';
import { useRouter } from 'next/router';
import { AccountCycle } from '@/models';
import { useAccountContext, useDataContext, useUserContext } from '@/context';
import { FormFieldSelect, FormFieldText } from '@/components/form';

import styles from '@/styles/Introduction.module.css';

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

export default function IntroductionPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { account } = useAccountContext();
  const { user } = useUserContext();
  const { updateData } = useDataContext();

  const handleSubmit = useCallback((formData: any) => {
    const submitData = {
      user: {
        id: user?.id,
        name: formData.userName
      },
      accounts: [{
        id: account.id,
        userId: user?.id,
        name: formData.accountName,
        cycle: formData.accountCycle,
      }]
    };
    updateData(submitData);
    router.push(`/accounts/${account.id}`);
  }, [user, account, router, updateData]);

  return (
    <div className={styles.introduction}>
      <Form
        {...formLayout}
        form={form}
        name="introduction-form"
        layout="vertical"
        onFinish={handleSubmit}
      >
        <FormFieldText label="What is your name?" name="userName" required />
        <FormFieldText label="Name of your first account? (e.g. Checkings)" name="accountName" required />
        <FormFieldSelect label="Account financial cycle?" name="accountCycle" options={cycleOptions} required />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
