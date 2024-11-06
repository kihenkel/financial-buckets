import { Account } from '@/models';
import { AccountTypeMap } from '@/utils/accountUtils';
import { Descriptions } from 'antd';
import { EditableText } from '../EditableText/EditableText';
import { useDataContext } from '@/context';
import { useCallback } from 'react';
import { withFallback } from '@/utils/stringUtils';
import EditablePercentage from '../EditableText/EditablePercentage';
import EditableDate from '../EditableText/EditableDate';

interface AccountInfoProps {
  account: Partial<Account>;
}

export const AccountInfo = ({ account }: AccountInfoProps) => {
  const { updateData } = useDataContext();

  const handleDataEdit = useCallback((value: string | number, key: keyof Account) => {
    updateData({
      accounts: [{
        id: account.id,
        [key]: value,
      }],
    });
  }, [updateData, account.id]);
  
  return (
    <Descriptions title="Account Info" size="small" bordered layout="vertical">
      <Descriptions.Item key="name" label="Name">
        <EditableText text={withFallback(account.name)} onEdit={(val) => handleDataEdit(val, 'name')} />
      </Descriptions.Item>
      <Descriptions.Item key="type" label="Type">
        {withFallback(account.type && AccountTypeMap[account.type])}
      </Descriptions.Item>
      <Descriptions.Item key="interestRate" label="Interest">
        <EditablePercentage text={account.interestRate} onEdit={(val) => handleDataEdit(val, 'interestRate')} />
      </Descriptions.Item>
      <Descriptions.Item key="openDate" label="Opened">
        <EditableDate text={account.openDate} onEdit={(val) => handleDataEdit(val, 'openDate')} />
      </Descriptions.Item>
      <Descriptions.Item key="maturityDate" label="Matures">
        <EditableDate text={account.maturityDate} onEdit={(val) => handleDataEdit(val, 'maturityDate')} />
      </Descriptions.Item>
    </Descriptions>
  );
};
