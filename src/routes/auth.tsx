import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router';

import { Layout as AuthModernLayout } from 'src/layouts/auth/modern-layout';
import { Outlet } from 'react-router-dom';
import { UserProvider } from 'src/contexts/user/userContext';

const ForgotPasswordModernPage = lazy(() => import('src/pages/auth/forgot-password/modern'));
const LoginModernPage = lazy(() => import('src/pages/auth/login/login'));
const SignInModernPage = lazy(() => import('src/pages/auth/signin/signin'));
const RegisterModernPage = lazy(() => import('src/pages/auth/register/registerSupplier'));
const RegisterModernCompany = lazy(() => import('src/pages/auth/register/registerCompany'));
const ResetPasswordModernPage = lazy(() => import('src/pages/auth/reset-password/reset-password'));
const VerifyCodeModernPage = lazy(() => import('src/pages/auth/verify-code/verify-code'));
const RecoverModernPage = lazy(() => import('src/pages/auth/recover/recover'));
const RecoverModernSuccess = lazy(() => import('src/pages/auth/recover/recover-success'));
const VerifyOTP = lazy(() => import('src/pages/auth/verify-code/otp'));

export const authDemoRoutes: RouteObject[] = [
  {
    path: 'auth',
    children: [
      {
        element: (
          <UserProvider>
            <AuthModernLayout>
              <Suspense>
                <Outlet />
              </Suspense>
            </AuthModernLayout>
          </UserProvider>
        ),
        children: [
          {
            path: 'forgot-password',
            element: <ForgotPasswordModernPage />,
          },
          {
            index: true,
            path: 'login',
            element: <LoginModernPage />,
          },
          {
            path: 'signin',
            element: <SignInModernPage />,
          },
          {
            path: 'register',
            element: <RegisterModernPage />,
          },
          {
            path: 'registerCompany',
            element: <RegisterModernCompany />,
          },
          {
            path: 'reset-password',
            element: <ResetPasswordModernPage />,
          },
          {
            path: 'recover-success',
            element: <RecoverModernSuccess />,
          },
          {
            path: 'verify-otp',
            element: <VerifyOTP />,
          },
          {
            path: 'recover',
            element: <RecoverModernPage />,
          },
        ],
      },
    ],
  },
];
