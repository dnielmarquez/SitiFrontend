import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import SendIcon from '@mui/icons-material/Send';
import WalletIcon from '@mui/icons-material/Wallet';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useEffect, useState } from 'react';
import { useUser } from 'src/contexts/user/userContext';
import Tooltip from '@mui/material/Tooltip';
import { fetchAllUsers } from 'src/services/userAPI';
import type { Request } from 'src/types/request';
import { UserListTable } from 'src/sections/dashboard/admin/user-list-table';
import { User } from 'src/types/user';
import { getRequestsByEmployee } from 'src/services/requestAPI';
import { SupplierOrderListTable } from 'src/sections/dashboard/supplier/supplier-orders-list-table';
const Page = () => {
  const [orders, setOrders] = useState<Request[] | []>([]);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipTitle, setTooltipTitle] = useState('Copy to clipboard');
  const [isPressed, setIsPressed] = useState(false);

  const { token, userId } = useUser();
  usePageView();
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersByUser = await getRequestsByEmployee(token, userId); // This should fetch users with role SUPPLIER
        if (ordersByUser.id) {
          setOrders(ordersByUser.assignedRequests);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    loadOrders();
  }, [token]);

  const handleCopy = () => {
    setTooltipTitle('Card copied!');
    setTooltipOpen(true);

    setTimeout(() => {
      setTooltipOpen(false);
      // Reset tooltip after it's hidden
      setTimeout(() => setTooltipTitle('Copy to clipboard'), 500);
    }, 2000); // hide tooltip after 2 seconds
  };

  return (
    <>
      <Seo title="Dashboard" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Stack
            spacing={1}
            sx={{ mb: 4 }}
          >
            <Stack
              alignItems="center"
              direction="row-reverse"
              spacing={1}
            ></Stack>
          </Stack>
          <Stack spacing={4}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">Supplier Dashboard</Typography>
              </Stack>
              <Stack
                alignItems="center"
                direction="row"
                spacing={3}
              ></Stack>
            </Stack>
            <Card>
              <SupplierOrderListTable orders={orders} />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
