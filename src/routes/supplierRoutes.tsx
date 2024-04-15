import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
const SupplierDashboard = lazy(() => import('src/pages/dashboard/dashboardSupplier'));
const SupplierCompletedDashboard = lazy(
  () => import('src/pages/dashboard/dashboardSupplierCompleted')
);
const SupplierRepairDashboard = lazy(() => import('src/pages/dashboard/dashboardSupplierRepair'));
const SupplierReplaceDashboard = lazy(() => import('src/pages/dashboard/dashboardSupplierReplace'));
const SupplierChecklist = lazy(() => import('src/pages/supplierChecklist/supplierChecklist'));

const SupplierRoutes = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['SUPPLIER']}>
            <SupplierDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboardCompleted"
        element={
          <ProtectedRoute allowedRoles={['SUPPLIER']}>
            <SupplierCompletedDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboardRepair"
        element={
          <ProtectedRoute allowedRoles={['SUPPLIER']}>
            <SupplierRepairDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboardReplace"
        element={
          <ProtectedRoute allowedRoles={['SUPPLIER']}>
            <SupplierReplaceDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supplier-checklist/:orderId"
        element={
          <ProtectedRoute allowedRoles={['SUPPLIER']}>
            <SupplierChecklist />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default SupplierRoutes;
