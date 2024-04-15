import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
const AdminDashboard = lazy(() => import('src/pages/dashboard/dashboardAdmin'));

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AdminRoutes;
