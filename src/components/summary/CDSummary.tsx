import { Table, Tag, Typography } from 'antd';
import { Row } from '../layout/Layout';
import { Account } from '@/models';
import React, { useMemo } from 'react';
import { calculateCDInterest, toPercentage } from '@/utils/numberUtils';
import { toCurrency } from '@/utils/toCurrency';
import { toLocalDate } from '@/utils/dateUtils';
import { useUserConfigContext } from '@/context';
import { N_A } from '@/utils/stringUtils';

interface CDAccount extends Account {
  estimatedInterest: number;
}

export interface CDSummaryProps {
  cdAccounts: Account[];
}

const THREE_MONTHS_IN_MS = 1000 * 60 * 60 * 24 * 30 * 3;

const renderMaturityDate = (maturityDateString: string): React.ReactNode => {
  if (!maturityDateString) return N_A;
  const localDate = toLocalDate(maturityDateString);
  const now = new Date().valueOf();
  const maturityDate = new Date(maturityDateString).valueOf();
  if (now > maturityDate) return <>{localDate} <Tag color="red">Matured</Tag></>;
  if (maturityDate - now <= THREE_MONTHS_IN_MS) return <>{localDate} <Tag color="gold">Matures soon</Tag></>;
  return localDate;
};

const CDSummary = ({ cdAccounts }: CDSummaryProps) => {
  const { locale, currency } = useUserConfigContext();
  const cdAccountsCustom: CDAccount[] = useMemo(() => {
    return cdAccounts
      .map((account) => {
        const { balance, interestRate, openDate, maturityDate } = account;
        const estimatedInterest: number = interestRate && openDate && maturityDate ? 
          calculateCDInterest(balance, interestRate * 100, new Date(openDate), new Date(maturityDate)) :
          -1;
        return {
          ...account,
          estimatedInterest,
        };
      })
      .sort((a, b) => {
        if (!a.maturityDate) return 1;
        if (!b.maturityDate) return -1;
        return new Date(a.maturityDate).valueOf() - new Date(b.maturityDate).valueOf();
      });
  }, [cdAccounts]);

  return (
    <>
      <Row><Typography.Title level={4}>CDs</Typography.Title></Row>
      <Table<CDAccount> dataSource={cdAccountsCustom} pagination={false}>
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column title="Initial Deposit" dataIndex="balance" key="initialDeposit" render={(value: number) => toCurrency(value, locale, currency)} />
        <Table.Column title="Open Date" dataIndex="openDate" key="openDate" render={toLocalDate} />
        <Table.Column title="Maturity Date" dataIndex="maturityDate" key="maturityDate" render={renderMaturityDate} />
        <Table.Column title="Interest Rate" dataIndex="interestRate" key="interestRate" render={(value: string) => toPercentage(value, locale)} />
        <Table.Column title="Estimated Interest" dataIndex="estimatedInterest" key="estimatedInterest" render={(value: number) => value >= 0 ? toCurrency(value, locale, currency) : N_A } />
      </Table>
    </>
  );
};

export default CDSummary;