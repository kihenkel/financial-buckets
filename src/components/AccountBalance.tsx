import { InputNumber, Typography } from 'antd';
import { EventHandler, useCallback, useRef } from 'react';
import { useAccountContext, useUserConfigContext, useDataContext } from '@/context';
import { toCurrency } from '@/utils/toCurrency';

const { Text } = Typography;

export const AccountBalance = () => {
  const { locale, currency } = useUserConfigContext();
  const { account } = useAccountContext();
  const { updateData } = useDataContext();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = useCallback<EventHandler<any>>((event) => {
    const newBalance = Number.parseFloat(String(event.target.value));
    if (!isNaN(newBalance)) {
      updateData({
        accounts: [{
          id: account.id,
          userId: account.userId,
          balance: newBalance,
        }]
      });
    }
  }, [account.id, account.userId, updateData]);

  const formatter = useCallback((value: string | undefined, info: { userTyping: boolean, input: string }) => {
    if (info.userTyping) {
      return value ?? '';
    }
    return toCurrency(value, locale, currency);
  }, [locale, currency]);

  return (
    <InputNumber
      ref={inputRef}
      defaultValue={String(account.balance ?? 0)}
      addonBefore={<Text strong>Account</Text>}
      onClick={() => inputRef.current?.select()}
      onPressEnter={handleChange}
      onBlur={handleChange}
      formatter={formatter}
      controls={false}
    />
  );
};
