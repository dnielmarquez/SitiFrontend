import React, { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './protected-route';
const CompanyDashboard = lazy(() => import('src/pages/dashboard/dashboardCompany'));
const CompanyDashboardCompleted = lazy(
  () => import('src/pages/dashboard/dashboardCompanyCompleted')
);
const CompanyDashboardRepair = lazy(() => import('src/pages/dashboard/dashboardCompanyRepair'));
const CompanyDashboardReplace = lazy(() => import('src/pages/dashboard/dashboardCompanyReplace'));
const SummaryPage = lazy(() => import('src/pages/requestSummary/requestSummary'));
const CompanyRoutes = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['COMPANY_PIC']}>
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboardCompleted"
        element={
          <ProtectedRoute allowedRoles={['COMPANY_PIC']}>
            <CompanyDashboardCompleted />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboardRepair"
        element={
          <ProtectedRoute allowedRoles={['COMPANY_PIC']}>
            <CompanyDashboardRepair />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboardReplace"
        element={
          <ProtectedRoute allowedRoles={['COMPANY_PIC']}>
            <CompanyDashboardReplace />
          </ProtectedRoute>
        }
      />
      <Route
        path="/requestSummary/:orderId"
        element={
          <ProtectedRoute allowedRoles={['COMPANY_PIC']}>
            <SummaryPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default CompanyRoutes;
