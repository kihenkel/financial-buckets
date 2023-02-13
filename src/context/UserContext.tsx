import React, { useContext, useState } from 'react';
import { User } from '@/models';

interface UserContext {
  user: User | null;
  setUser(user: User): void;
}

interface UserContextProviderProps {
  children: any;
}

const initialData = {
  user: null,
  setUser: () => {}
};

export const UserContext = React.createContext<UserContext>(initialData);

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const [user, setUser] = useState<User |  null>(null);

  const value: UserContext = {
    user,
    setUser,
  };
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
