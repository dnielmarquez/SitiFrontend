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
const Page = () => {
  const [users, setUsers] = useState<User[] | []>([]);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipTitle, setTooltipTitle] = useState('Copy to clipboard');
  const [isPressed, setIsPressed] = useState(false);
  const { token } = useUser();
  usePageView();
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchAllUsers(token); // This should fetch users with role SUPPLIER
        setUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    loadUsers();
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
            >
  
            </Stack>
          </Stack>
          <Stack spacing={4}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">Admin Dashboard</Typography>
              </Stack>
              <Stack
                alignItems="center"
                direction="row"
                spacing={3}
              >
                
              </Stack>
            </Stack>
            <Card>
              <UserListTable users={users} />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
