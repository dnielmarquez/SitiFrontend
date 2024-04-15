import React from 'react';
import { useAuth } from '../contexts/auth/auth-context';
import { Navigate, RouteProps } from 'react-router-dom';
import { useUser } from 'src/contexts/user/userContext';

export const ProtectedRoute: React.FC<RouteProps & { allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
  ...rest
}) => {
  const { isVerified, isAuthenticated, loading } = useAuth();
  const { userRole } = useUser();

  if (!loading) {
    if (!isAuthenticated) {
      // Redirect to the login page if not authenticated.
      return (
        <Navigate
          to="/auth/login"
          replace
        />
      );
    } else if (!isVerified) {
      // Redirect to the verification page if not verified.
      return (
        <Navigate
          to="/auth/verify-otp"
          replace
        />
      );
    } else if (allowedRoles && !allowedRoles.includes(userRole)) {
      // Redirect to an unauthorized page if the user does not have the required role.
      return (
        <Navigate
          to="/unauthorized"
          replace
        />
      );
    }
  }

  return <React.Fragment>{children}</React.Fragment>;
};
