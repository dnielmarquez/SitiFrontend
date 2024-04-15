import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'src/contexts/auth/auth-context';
import { useUser } from 'src/contexts/user/userContext';

const RoleBasedDashboard = () => {
  const { userRole } = useUser(); // Assuming you have a loading state in your user context
  const { loading } = useAuth();
  // If still loading, don't redirect yet
  if (loading) {
    return <div>Loading...</div>; // or any loading indicator you prefer
  }

  console.log('User role:', userRole);

  switch (userRole) {
    case 'ADMIN':
      return (
        <Navigate
          to="/admin/dashboard"
          replace
        />
      );
    case 'COMPANY_PIC':
      return (
        <Navigate
          to="/company/dashboard"
          replace
        />
      );
    case 'SUPPLIER':
      return (
        <Navigate
          to="/supplier/dashboard"
          replace
        />
      );
    // Add cases for other roles
    default:
      // Redirect to login if no valid role is found (only after loading is complete)
      return (
        <Navigate
          to="/auth/login"
          replace
        />
      );
  }
};

export default RoleBasedDashboard;
