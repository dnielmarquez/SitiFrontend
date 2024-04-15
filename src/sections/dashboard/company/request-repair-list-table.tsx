import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { updateRequest, deleteRequest } from 'src/services/requestAPI'; // Adjust the import path as needed

// Assuming Request interface is defined based on your data structure
import type { Request } from 'src/types/request';
import { Scrollbar } from 'src/components/scrollbar';
import { fetchAllSuppliers } from 'src/services/userAPI';
import { Chip } from '@mui/material';
import { formatDate } from 'src/utils/format-date';
import { status } from 'nprogress';
import { useNavigate } from 'react-router';

export const RequestRepairListTable = (props: { requests: Request[] | [] }) => {
  const defaultRequest: Request = {
    // Provide default values for all fields
    id: '',
    createdByUserId: '',
    productName: 'VAULT', // Default value
    productRequirements: '',
    process: [], // Default value
    assignedSupplierIds: [],
    assignmentDate: '',
    dueDate: '',
    createdAt: '',
    updatedAt: '',
  };
  const navigate = useNavigate();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);
  const [allSuppliers, setAllSuppliers] = useState<{ id: string; supplierName: string }[]>([]);
  const [dynamicProductRequirements, setDynamicProductRequirements] = useState<any[]>([]);
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const suppliers = await fetchAllSuppliers(); // This should fetch users with role SUPPLIER
        setAllSuppliers(suppliers);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    loadSuppliers();
  }, []);

  const handleEditSave = async () => {
    if (currentRequest && currentRequest.id) {
      try {
        let reqToSend = { ...currentRequest };
        // Format dates to ISO 8601
        reqToSend.assignmentDate = reqToSend.assignmentDate
          ? new Date(reqToSend.assignmentDate).toISOString()
          : null;
        reqToSend.dueDate = reqToSend.dueDate ? new Date(reqToSend.dueDate).toISOString() : null;
        // Manually map dynamic fields to the productRequirements JSON
        const productRequirements: Record<string, any> = {};

        dynamicProductRequirements.forEach((field) => {
          productRequirements[field.name] = field.value;
        });
        reqToSend.productRequirements = JSON.stringify(productRequirements);
        console.log('OBJSENT', reqToSend);

        // Assuming updateRequest is a function that sends a PUT request to your API
        console.log('data to send', reqToSend);
        await updateRequest(currentRequest.id, reqToSend);
        setEditModalOpen(false);
        // Optionally refresh the list or show a success message
      } catch (error) {
        console.error('Error updating request:', error);
      }
    }
  };
  const handleDynamicFieldChange = (fieldName: string, value: any) => {
    const updatedFields = [...dynamicProductRequirements];
    const existingFieldIndex = updatedFields.findIndex((field) => field.name === fieldName);

    if (existingFieldIndex !== -1) {
      updatedFields[existingFieldIndex].value = value;
    } else {
      updatedFields.push({ name: fieldName, value });
    }

    setDynamicProductRequirements(updatedFields);
  };
  const handleEdit = (requestId: string) => {
    const requestToEdit = props.requests.find((r) => r.id === requestId);
    if (requestToEdit) {
      setCurrentRequest({
        ...requestToEdit,
        assignedSupplierIds: requestToEdit.assignedSuppliers?.map((supplier) => supplier.id), // Extracting IDs from assignedSuppliers
      });
      const toConvert: string = requestToEdit.productRequirements as string;
      console.log('REQUEST TO EDIT', JSON.parse(toConvert));
      // Initialize dynamicProductRequirements with existing productRequirements data
      try {
        const existingProductRequirements = JSON.parse(toConvert || '{}');
        const dynamicFields = Object.entries(existingProductRequirements).map(([name, value]) => ({
          name,
          value,
        }));
        setDynamicProductRequirements(dynamicFields);
      } catch (error) {
        console.error('Error parsing productRequirements:', error);
        // Handle the error if JSON parsing fails
      }

      setEditModalOpen(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (currentRequest && currentRequest.id) {
      try {
        await deleteRequest(currentRequest.id); // Assume deleteRequest is an API call
        setDeleteDialogOpen(false);
        // Optionally refresh the list or show a success message
        window.location.reload();
      } catch (error) {
        // Handle error
        console.error('Error deleting request:', error);
      }
    }
  };

  const handleDelete = (requestId: any) => {
    const requestToEdit = props.requests.find((r) => r.id === requestId);
    // Set current request ID or entire object based on your need
    if (requestToEdit) {
      setCurrentRequest({
        ...requestToEdit,
      });
    }
    setDeleteDialogOpen(true);
  };
  // Function to render dynamic product requirement fields based on selected processes

  return (
    <Box sx={{ position: 'relative' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 700 }}>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Process</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Assignment Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.requests
              .filter((request) => request.status === 'Repair') // Filtrado basado en el estado
              .map((request) => (
                <TableRow
                  hover
                  key={request.id}
                >
                  <TableCell>{request.productName}</TableCell>
                  <TableCell>
                    {request.process &&
                      request.process?.map((processVal, index) => {
                        var returnedVal = processVal;
                        if (request.process && index < request.process.length - 1) {
                          returnedVal += ', ';
                        }
                        return returnedVal;
                      })}
                  </TableCell>
                  <TableCell>{request.dueDate && formatDate(request.dueDate)}</TableCell>
                  <TableCell>
                    {request.assignmentDate && formatDate(request.assignmentDate)}
                  </TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell align="right">
                    <Stack
                      direction="row"
                      spacing={1}
                    >
                      {request.status == 'Repair' && (
                        <>
                          <Button
                            onClick={() =>
                              navigate('/company/requestSummary/' + request.id?.toString() + '')
                            }
                            variant="contained"
                          >
                            Check Review
                          </Button>
                          {request?.blockchainTx && (
                            <>
                              <Button
                                variant="contained"
                                sx={{ ml: 2 }}
                                onClick={() =>
                                  window.open(
                                    'https://testnet.bscscan.com/tx/' + request.blockchainTx,
                                    '_blank'
                                  )
                                }
                              >
                                See tx on Blockchain
                              </Button>
                            </>
                          )}
                          {request?.fileOnchainHash && (
                            <Button
                              variant="contained"
                              sx={{ ml: 2 }}
                              onClick={() =>
                                window.open(
                                  'https://ipfs.io/ipfs/' + request.fileOnchainHash,
                                  '_blank'
                                )
                              }
                            >
                              See PDF
                            </Button>
                          )}
                        </>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </Box>
  );
};
