import { useCallback } from 'react';
import { Button, Form, FormInstance, Typography } from 'antd';
import { useRouter } from 'next/router';
import { Account, AccountCycle, AccountType } from '@/models';
import { useDataContext, useUserContext } from '@/context';
import { FormFieldDate, FormFieldNumber, FormFieldPercentage, FormFieldSelect, FormFieldText } from '@/components/form';

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

const isSavings = (form: FormInstance) => form.getFieldValue('accountType') === 'savings';
const isCD = (form: FormInstance) => form.getFieldValue('accountType') === 'cd';
const isSavingsOrCD = (form: FormInstance) => isSavings(form) || isCD(form);

export default function NewAccountPage() {
  const router = useRouter();
  const [form] = Form.useForm();
  Form.useWatch('accountType', form);
  const { user } = useUserContext();
  const { updateData } = useDataContext();

  const handleSubmit = useCallback((formData: any) => {
    if (!user) {
      throw new Error('Cannot submit. No user data!');
    }
    const newAccountData: Partial<Account> = {
      userId: user?.id,
      name: formData.accountName,
      balance: formData.initialBalance,
      initialBalance: formData.initialBalance,
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

  console.log(form.getFieldValue('accountType'));
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
        <FormFieldText label="Name of the new account" name="accountName" required />
        <FormFieldSelect label="Account financial cycle" name="accountCycle" options={cycleOptions} required />
        <FormFieldSelect label="Account type" name="accountType" options={accountTypeOptions} required />
        <FormFieldNumber label="Initial balance" name="initialBalance" required={isCD(form)} />
        { isSavingsOrCD(form) ? <FormFieldPercentage label="Interest rate" name="interestRate" /> : null }
        { isCD(form) ? <FormFieldDate label="Open date" name="openDate" /> : null }
        { isCD(form) ? <FormFieldDate label="Maturity date" name="maturityDate" /> : null }
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
