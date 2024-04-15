import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { checkAuth } from 'src/services/userAPI';
import { useUser } from '../user/userContext';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';

interface AuthContextProps {
  isAuthenticated: boolean;
  isVerified: boolean;
  setIsVerified: (verified: boolean) => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  loading: boolean; // Introduce a loading state
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Initialize loading as true
  const { setToken, setUserId, setUserRole } = useUser();
  useEffect(() => {
    checkUserAuth().then(() => setLoading(false));
  }, []);

  const checkUserAuth = async () => {
    try {
      // Retrieve token from cookies
      const token = Cookies.get('token');

      if (token) {
        // Call the checkAuth function with the token
        const check = await checkAuth({ token });
        if (check.isAuthenticated) {
          setToken(token);
        }
        if (check.userId) {
          console.log('setting', check.userId);
          setUserId(check.userId);
        }
        if (check.role) {
          console.log('role', check.role);
          setUserRole(check.role);
        }
        setIsVerified(check.isVerified);
        setIsAuthenticated(check.isAuthenticated);
      } else {
        // No token found in cookies, set authentication to false
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isVerified, setIsVerified, isAuthenticated, setIsAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
