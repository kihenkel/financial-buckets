import { useCallback } from 'react';
import { Button, Form, Typography } from 'antd';
import { useRouter } from 'next/router';
import { Account, AccountCycle, AccountType } from '@/models';
import { useDataContext, useUserContext } from '@/context';
import { FormFieldDate, FormFieldPercentage, FormFieldSelect, FormFieldText } from '@/components/form';

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

const accountTypeOptions: { label: string; value: AccountType }[] = [{
  label: 'Checking',
  value: 'checking',
}, {
  label: 'Savings',
  value: 'savings',
}, {
  label: 'CD',
  value: 'cd',
}];

export default function NewAccountPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  const { user } = useUserContext();
  const { updateData } = useDataContext();

  const handleSubmit = useCallback((formData: any) => {
    if (!user) {
      throw new Error('Cannot submit. No user data!');
    }
    const newAccountData: Partial<Account> = {
      userId: user?.id,
      name: formData.accountName,
      balance: 0,
      cycle: formData.accountCycle,
      type: formData.accountType,
      interestRate: formData.interestRate,
      openDate: formData.openDate,
      maturityDate: formData.maturityDate,
    };
    const submitData = {
      accounts: [newAccountData]
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
        <FormFieldSelect label="Account type?" name="accountType" options={accountTypeOptions} required />
        <FormFieldPercentage label="Interest rate" name="interestRate" />
        <FormFieldDate label="Open date" name="openDate" />
        <FormFieldDate label="Maturity date" name="maturityDate" />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
