import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from '@mui/material';

import { tokens } from 'src/locales/tokens';
import { paths } from 'src/paths';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useUser } from 'src/contexts/user/userContext';

export interface Item {
  disabled?: boolean;
  external?: boolean;
  icon?: ReactNode;
  items?: Item[];
  label?: ReactNode;
  path?: string;
  title: string;
}

export interface Section {
  items: Item[];
  subheader?: string;
}

export const useSections = () => {
  const { t } = useTranslation();

  const { userRole } = useUser();
  const roleBasedMenu = () => {
    switch (userRole) {
      case 'ADMIN':
        return [
          {
            items: [
              {
                title: 'User Approvals',
                path: paths.index,
                icon: (
                  <SvgIcon fontSize="small">
                    <AccountBalanceWalletIcon />
                  </SvgIcon>
                ),
              },
            ],
          },
        ];
        break;
      case 'COMPANY_PIC':
        return [
          {
            items: [
              {
                title: 'Order List',
                path: paths.index,
                icon: (
                  <SvgIcon fontSize="small">
                    <AccountBalanceWalletIcon />
                  </SvgIcon>
                ),
              },
              {
                title: 'Completed Orders',
                path: 'company/dashboardCompleted',
                icon: (
                  <SvgIcon fontSize="small">
                    <AccountBalanceWalletIcon />
                  </SvgIcon>
                ),
              },
              {
                title: 'Orders to repair',
                path: 'company/dashboardRepair',
                icon: (
                  <SvgIcon fontSize="small">
                    <AccountBalanceWalletIcon />
                  </SvgIcon>
                ),
              },
              {
                title: 'Orders to replace',
                path: 'company/dashboardReplace',
                icon: (
                  <SvgIcon fontSize="small">
                    <AccountBalanceWalletIcon />
                  </SvgIcon>
                ),
              },
            ],
          },
        ];
        break;
      case 'SUPPLIER':
        return [
          {
            items: [
              {
                title: 'Order Checklists',
                path: paths.index,
                icon: (
                  <SvgIcon fontSize="small">
                    <AccountBalanceWalletIcon />
                  </SvgIcon>
                ),
              },
              {
                title: 'Completed Orders',
                path: 'supplier/dashboardCompleted',
                icon: (
                  <SvgIcon fontSize="small">
                    <AccountBalanceWalletIcon />
                  </SvgIcon>
                ),
              },
              {
                title: 'Orders to repair',
                path: 'supplier/dashboardRepair',
                icon: (
                  <SvgIcon fontSize="small">
                    <AccountBalanceWalletIcon />
                  </SvgIcon>
                ),
              },
              {
                title: 'Orders to replace',
                path: 'supplier/dashboardReplace',
                icon: (
                  <SvgIcon fontSize="small">
                    <AccountBalanceWalletIcon />
                  </SvgIcon>
                ),
              },
            ],
          },
        ];
        break;
    }
  };
  return useMemo(() => {
    return roleBasedMenu();
  }, [userRole, t]); // Add userRole as a dependency
};
