import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Scrollbar } from 'src/components/scrollbar';

import { Request } from 'src/types/request';
import { useNavigate } from 'react-router';

export const SupplierRepairOrderListTable = (props: { orders: Request[] }) => {
  const navigate = useNavigate();
  const goToOrder = (orderId: string | undefined) => {
    if (orderId != undefined) {
      navigate('/supplier/supplier-checklist/' + orderId);
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Process</TableCell>
              <TableCell>Assignment Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.orders
              .filter((request) => request.status === 'Repair') // Filtrado basado en el estado
              .map((order) => (
                <TableRow
                  hover
                  key={order.id}
                >
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.productName}</TableCell>
                  <TableCell>{order.process?.join(', ')}</TableCell>
                  <TableCell>{order.assignmentDate?.split('T')[0]}</TableCell>
                  <TableCell>{order.dueDate?.split('T')[0]}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => goToOrder(order.id)}
                    >
                      Checklist
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </Box>
  );
};
