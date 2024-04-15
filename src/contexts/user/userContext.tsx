import React, { createContext, useContext, ReactNode, useState } from 'react';

interface UserContextProps {
  token: string | '';
  setToken: (key: string | '') => void;
  userId: string | '';
  setUserId: (key: string | '') => void;
  userRole: string | '';
  setUserRole: (key: string | '') => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | ''>('');
  const [userId, setUserId] = useState<string | ''>('');
  const [userRole, setUserRole] = useState<string | ''>('');
  return (
    <UserContext.Provider value={{ token, setToken, userId, setUserId, userRole, setUserRole }}>
      {children}
    </UserContext.Provider>
  );
};
