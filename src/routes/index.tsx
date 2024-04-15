import { Suspense, lazy } from 'react';
import type { RouteObject } from 'react-router';
import { Outlet } from 'react-router-dom';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';
import { authDemoRoutes } from './auth';
import { ProtectedRoute } from './protected-route';
import { AuthProvider } from '../contexts/auth/auth-context';
import { UserProvider } from 'src/contexts/user/userContext';
import AdminRoutes from './adminRoutes';
import CompanyRoutes from './companyRoutes';
import SupplierRoutes from './supplierRoutes';

import RoleBasedDashboard from './roleBasedDashboardRoute';
import NotFound from 'src/pages/notfound/NotFound';

export const routes: RouteObject[] = [
  {
    element: (
      <UserProvider>
        <AuthProvider>
          <DashboardLayout>
            <Suspense fallback={<div>Loading...</div>}>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </AuthProvider>
      </UserProvider>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <RoleBasedDashboard />
          </ProtectedRoute>
        ),
      },
      { path: 'admin/*', element: <AdminRoutes /> },
      { path: 'company/*', element: <CompanyRoutes /> },
      { path: 'supplier/*', element: <SupplierRoutes /> },
      // Any other protected children routes would be added here.
    ],
  },
  {
    path: '*', // This matches any path not matched above
    element: <NotFound />,
  },
  ...authDemoRoutes, // Assuming these are public routes.
];
