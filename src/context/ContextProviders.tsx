import { AccountContextProvider, UserContextProvider, UserConfigContextProvider, DataContextProvider } from '@/context';

interface ContextProvidersProps {
  children: React.ReactNode;
}

export const ContextProviders = ({ children }: ContextProvidersProps) => {
  return (
    <UserConfigContextProvider>
      <AccountContextProvider>
        <UserContextProvider>
          <DataContextProvider>
            {children}
          </DataContextProvider>
        </UserContextProvider>
      </AccountContextProvider>
    </UserConfigContextProvider>
  );
};
