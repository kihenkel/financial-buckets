import {
  AccountContextProvider,
  UserContextProvider,
  UserConfigContextProvider,
  DataContextProvider,
  NotificationContextProvider,
} from '@/context';

interface ContextProvidersProps {
  children: React.ReactNode;
}

export const ContextProviders = ({ children }: ContextProvidersProps) => {
  return (
    <UserConfigContextProvider>
      <AccountContextProvider>
        <UserContextProvider>
          <DataContextProvider>
            <NotificationContextProvider>
              {children}
            </NotificationContextProvider>
          </DataContextProvider>
        </UserContextProvider>
      </AccountContextProvider>
    </UserConfigContextProvider>
  );
};
