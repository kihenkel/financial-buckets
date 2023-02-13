import React, { useContext, useState } from 'react';
import { Account } from '@/models';

interface AccountContext {
  account: Partial<Account>;
  setAccount(account: Account): void;
}

interface AccountContextProviderProps {
  children: any;
}

const initialData = {
  account: {},
  setAccount: () => {}
};

export const AccountContext = React.createContext<AccountContext>(initialData);

export const AccountContextProvider = ({ children }: AccountContextProviderProps) => {
  const [account, setAccount] = useState<Partial<Account>>({});

  const value: AccountContext = {
    account,
    setAccount,
  };
  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => {
  return useContext(AccountContext);
};
