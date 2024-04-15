import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Scrollbar } from 'src/components/scrollbar';

// Assuming the User interface is imported from your types
import type { User } from 'src/types/user';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { approveUser } from 'src/services/userAPI';
import { useUser } from 'src/contexts/user/userContext';

export const UserListTable = (props: { users: User[] }) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { token } = useUser();
  const sortedUsers = useMemo(() => {
    return [...props.users].sort((a, b) => {
      // Assuming 'verified' is a boolean or a value that can be directly compared
      return a.verified === b.verified ? 0 : a.verified ? 1 : -1;
    });
  }, [props.users]);

  const openConfirmDialog = (userId: string) => {
    setSelectedUserId(userId);
    setConfirmDialogOpen(true);
  };

  const handleApproveUser = async () => {
    if (selectedUserId) {
      try {
        console.log('Approve user:', selectedUserId);
        // Implement API call to approve the user
        // Close the dialog
        const approving = await approveUser({ token: token, userId: selectedUserId });
        if (approving) {
          window.location.reload();
        }
        setConfirmDialogOpen(false);
      } catch (error) {
        alert('Error approving user');
        console.log(error);
        setConfirmDialogOpen(false);
      }
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Contact Number</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Employee Name</TableCell>
              <TableCell>Supplier Name</TableCell>
              <TableCell>Verified</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers.map((user) => (
              <TableRow
                hover
                key={user.id}
              >
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.companyName}</TableCell>
                <TableCell>{user.position}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.contactNumber}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.employeeName}</TableCell>
                <TableCell>{user.supplierName}</TableCell>
                <TableCell>{user.verified ? 'Yes' : 'No'}</TableCell>
                <TableCell align="right">
                  <Button
                    onClick={() => openConfirmDialog(user.id)}
                    variant="contained"
                    color="primary"
                    disabled={user.verified ? true : false}
                  >
                    Approve
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm User Approval</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to approve this user?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleApproveUser}
            color="primary"
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
