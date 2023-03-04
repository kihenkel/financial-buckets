import React, { useContext, useState } from 'react';

interface NotificationContext {
  error: string;
  setError(message: string): void;
  warning: string;
  setWarning(message: string): void;
  info: string;
  setInfo(message: string): void;
}

interface NotificationContextProviderProps {
  children: any;
}

const initialData = {
  error: '',
  setError: () => {},
  warning: '',
  setWarning: () => {},
  info: '',
  setInfo: () => {},
};

export const NotificationContext = React.createContext<NotificationContext>(initialData);

export const NotificationContextProvider = ({ children }: NotificationContextProviderProps) => {
  const [error, setErrorState] = useState<string>('');
  const [warning, setWarningState] = useState<string>('');
  const [info, setInfoState] = useState<string>('');

  const value: NotificationContext = {
    error,
    setError: (handler) => setErrorState(() => handler),
    warning,
    setWarning: (handler) => setWarningState(() => handler),
    info,
    setInfo: (handler) => setInfoState(() => handler),
  };
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  return useContext(NotificationContext);
};
