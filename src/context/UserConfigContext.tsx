import React, { useContext, useState } from 'react';

export type Currency = 'USD';
export type Locale = 'en-US';

interface UserConfigContext {
  locale: Locale;
  setLocale(locale: Locale): void;
  currency: Currency;
  setCurrency(currency: Currency): void;
}

interface UserConfigContextProviderProps {
  children: any;
}

const initialData: UserConfigContext = {
  locale: 'en-US',
  setLocale: () => {},
  currency: 'USD',
  setCurrency: () => {},
};

export const UserConfigContext = React.createContext<UserConfigContext>(initialData);

export const UserConfigContextProvider = ({ children }: UserConfigContextProviderProps) => {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [locale, setLocale] = useState<Locale>('en-US');

  const value: UserConfigContext = {
    locale,
    setLocale,
    currency,
    setCurrency,
  };
  return (
    <UserConfigContext.Provider value={value}>
      {children}
    </UserConfigContext.Provider>
  );
};

export const useUserConfigContext = () => {
  return useContext(UserConfigContext);
};