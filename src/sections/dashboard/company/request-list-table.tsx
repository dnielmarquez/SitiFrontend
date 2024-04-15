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

export const RequestListTable = (props: { requests: Request[] | [] }) => {
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
  const renderDynamicFields = () => {
    const selectedProcesses = currentRequest?.process || [];

    // Reset dynamic fields when no process is selected
    if (selectedProcesses.length === 0) {
      return null;
    }

    const fields: any[] = [];

    // Loop through selected processes and render fields accordingly
    selectedProcesses.forEach((process: any) => {
      switch (process) {
        case 'MACHINING':
          fields.push(
            <div key="machining-fields">
              <Typography variant="h5">Machining Requirements:</Typography>
              <div>
                <FormControl
                  fullWidth
                  margin="normal"
                >
                  <InputLabel
                    sx={{ mt: -1 }}
                    shrink={true}
                  >
                    Scratches
                  </InputLabel>
                  <Select
                    value={
                      dynamicProductRequirements.find((field) => field.name === 'Scratches')
                        ?.value || ''
                    }
                    onChange={(e) => handleDynamicFieldChange('Scratches', e.target.value)}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div>
                <FormControl
                  fullWidth
                  margin="normal"
                >
                  <InputLabel
                    sx={{ mt: -1 }}
                    shrink={true}
                  >
                    Dented
                  </InputLabel>
                  <Select
                    value={
                      dynamicProductRequirements.find((field) => field.name === 'Dented')?.value ||
                      ''
                    }
                    onChange={(e) => handleDynamicFieldChange('Dented', e.target.value)}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div>
                <FormControl
                  fullWidth
                  margin="normal"
                >
                  <div>
                    <Typography variant="subtitle1">Length Range (mm):</Typography>
                    <Box
                      display="flex"
                      gap={2}
                    >
                      <TextField
                        label="Length Min (mm)"
                        type="number"
                        value={
                          dynamicProductRequirements.find((field) => field.name === 'LengthMin')
                            ?.value || ''
                        }
                        onChange={(e) => handleDynamicFieldChange('LengthMin', e.target.value)}
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="Length Max (mm)"
                        type="number"
                        value={
                          dynamicProductRequirements.find((field) => field.name === 'LengthMax')
                            ?.value || ''
                        }
                        onChange={(e) => handleDynamicFieldChange('LengthMax', e.target.value)}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  </div>
                </FormControl>
              </div>
              <div>
                <FormControl
                  fullWidth
                  margin="normal"
                >
                  <div>
                    <Typography variant="subtitle1">OD Range (mm):</Typography>
                    <Box
                      display="flex"
                      gap={2}
                    >
                      <TextField
                        label="OD Min (mm)"
                        type="number"
                        value={
                          dynamicProductRequirements.find((field) => field.name === 'ODMin')
                            ?.value || ''
                        }
                        onChange={(e) => handleDynamicFieldChange('ODMin', e.target.value)}
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="OD Max (mm)"
                        type="number"
                        value={
                          dynamicProductRequirements.find((field) => field.name === 'ODMax')
                            ?.value || ''
                        }
                        onChange={(e) => handleDynamicFieldChange('ODMax', e.target.value)}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  </div>
                </FormControl>
              </div>
              <div>
                <FormControl
                  fullWidth
                  margin="normal"
                >
                  <div>
                    <Typography variant="subtitle1">ID Range (mm):</Typography>
                    <Box
                      display="flex"
                      gap={2}
                    >
                      <TextField
                        label="ID Min (mm)"
                        type="number"
                        value={
                          dynamicProductRequirements.find((field) => field.name === 'IDMin')
                            ?.value || ''
                        }
                        onChange={(e) => handleDynamicFieldChange('IDMin', e.target.value)}
                        sx={{ flex: 1 }}
                      />
                      <TextField
                        label="ID Max (mm)"
                        type="number"
                        value={
                          dynamicProductRequirements.find((field) => field.name === 'IDMax')
                            ?.value || ''
                        }
                        onChange={(e) => handleDynamicFieldChange('IDMax', e.target.value)}
                        sx={{ flex: 1 }}
                      />
                    </Box>
                  </div>
                </FormControl>
              </div>
            </div>
          );
          break;

        case 'COATING':
          fields.push(
            <div key="coating-fields">
              <Typography variant="h5">Coating Requirements:</Typography>
              <div>
                <FormControl
                  fullWidth
                  margin="normal"
                >
                  <Box
                    display="flex"
                    gap={2}
                  >
                    <TextField
                      label="Thickness Min (micron)"
                      type="number"
                      value={
                        dynamicProductRequirements.find((field) => field.name === 'ThicknessMin')
                          ?.value || ''
                      }
                      onChange={(e) => handleDynamicFieldChange('ThicknessMin', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Thickness Max (micron)"
                      type="number"
                      value={
                        dynamicProductRequirements.find((field) => field.name === 'ThicknessMax')
                          ?.value || ''
                      }
                      onChange={(e) => handleDynamicFieldChange('ThicknessMax', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                  </Box>
                </FormControl>
              </div>
              <div>
                <FormControl
                  fullWidth
                  margin="normal"
                >
                  <InputLabel
                    sx={{ mt: -1 }}
                    shrink={true}
                  >
                    Porosity
                  </InputLabel>
                  <Select
                    value={
                      dynamicProductRequirements.find((field) => field.name === 'Porosity')
                        ?.value || ''
                    }
                    onChange={(e) => handleDynamicFieldChange('Porosity', e.target.value)}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          );
          break;

        case 'MACHINING_COATING':
          fields.push(
            <div key="machining-coating-fields">
              <Typography variant="subtitle1">Machining and Coating Requirements:</Typography>
              {/* Add fields specific to the combination of machining and coating */}
              {/* Example: */}
              <div>
                <FormControl
                  fullWidth
                  margin="normal"
                >
                  <InputLabel
                    sx={{ mt: -1 }}
                    shrink={true}
                  >
                    Combined Requirement
                  </InputLabel>
                  <TextField
                    type="text"
                    value={
                      dynamicProductRequirements.find(
                        (field) => field.name === 'Combined Requirement'
                      )?.value || ''
                    }
                    onChange={(e) =>
                      handleDynamicFieldChange('Combined Requirement', e.target.value)
                    }
                  />
                </FormControl>
              </div>
            </div>
          );
          break;

        // Add more cases for other process combinations as needed

        default:
          break;
      }
    });

    return fields;
  };
  return (
    <Box sx={{ position: 'relative' }}>
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        aria-labelledby="edit-request-modal"
        aria-describedby="edit-request-modal-description"
      >
        <Box
          sx={{
            // Add your modal styles here (example styles provided)
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            maxWidth: '90vw', // Set maximum width to 90% of the viewport width
            maxHeight: '80vh', // Set maximum height to 80% of the viewport height
            overflowY: 'auto', // Enable vertical scrolling if content exceeds the height
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography
            id="edit-request-modal"
            variant="h6"
            component="h2"
          >
            Edit Order
          </Typography>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ mt: 2 }}
          >
            <FormControl
              fullWidth
              margin="normal"
            >
              <InputLabel
                sx={{ mt: -1 }}
                id="product-name-label"
              >
                Product Name
              </InputLabel>
              <Select
                labelId="product-name-label"
                id="productName"
                value={currentRequest?.productName || defaultRequest.productName}
                label="Product Name"
                onChange={(e) =>
                  setCurrentRequest({
                    ...defaultRequest,
                    ...currentRequest,
                    productName: e.target.value as 'VAULT' | 'COVER',
                  })
                }
              >
                <MenuItem value="VAULT">VAULT</MenuItem>
                <MenuItem value="COVER">COVER</MenuItem>
              </Select>
            </FormControl>

            <FormControl
              fullWidth
              margin="normal"
            >
              <InputLabel
                sx={{ mt: -1 }}
                id="process-label"
              >
                Process
              </InputLabel>
              <Select
                labelId="process-label"
                id="process"
                multiple
                value={currentRequest?.process || []}
                onChange={(e) =>
                  setCurrentRequest({
                    ...(currentRequest || defaultRequest),
                    process: e.target.value as string[],
                  })
                }
                renderValue={(selected: string[]) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {currentRequest?.process &&
                      currentRequest.process.map((value) => {
                        return (
                          <Chip
                            key={value}
                            label={value}
                          />
                        );
                      })}
                  </Box>
                )}
              >
                <MenuItem
                  key="machining"
                  value="MACHINING"
                >
                  MACHINING
                </MenuItem>
                <MenuItem
                  key="coating"
                  value="COATING"
                >
                  COATING
                </MenuItem>
              </Select>
            </FormControl>
            {renderDynamicFields()}
            <FormControl
              fullWidth
              margin="normal"
            >
              <InputLabel
                sx={{ mt: -1 }}
                id="suppliers-label"
              >
                Assigned Suppliers
              </InputLabel>
              <Select
                labelId="suppliers-label"
                id="assignedSuppliers"
                multiple
                value={currentRequest?.assignedSupplierIds || []}
                onChange={(e) =>
                  setCurrentRequest({
                    ...(currentRequest || defaultRequest),
                    assignedSupplierIds: e.target.value as string[],
                  })
                }
                renderValue={(selected: any[]) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((supplierId: any) => {
                      // Find the corresponding supplier object based on the ID
                      const selectedSupplier = allSuppliers.find(
                        (supplier) => supplier.id === supplierId
                      );

                      return (
                        <Chip
                          key={supplierId}
                          label={selectedSupplier?.supplierName || ''}
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {allSuppliers.map((supplier) => (
                  <MenuItem
                    key={supplier.id}
                    value={supplier.id}
                  >
                    {supplier.supplierName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* Assignment Date Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="assignmentDate"
              label="Assignment Date"
              name="assignmentDate"
              type="date"
              value={currentRequest?.assignmentDate?.split('T')[0] || ''}
              onChange={(e) =>
                setCurrentRequest({
                  ...(currentRequest || defaultRequest),
                  assignmentDate: e.target.value, // Directly set the value from input
                })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
            {/* Due Date Field */}
            <TextField
              margin="normal"
              required
              fullWidth
              id="dueDate"
              label="Due Date"
              name="dueDate"
              type="date"
              value={currentRequest?.dueDate?.split('T')[0] || ''}
              onChange={(e) =>
                setCurrentRequest({
                  ...(currentRequest || defaultRequest),
                  dueDate: e.target.value,
                })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
            {/* Save Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleEditSave}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Delete Order'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            autoFocus
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
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
            {props.requests.map((request) => (
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
                    {request.status == 'ReadyForReview' && (
                      <>
                        <Button
                          startIcon={<EditIcon />}
                          onClick={() => handleEdit(request.id || '')}
                          variant="contained"
                        >
                          Edit
                        </Button>
                        <Button
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDelete(request.id)}
                          variant="contained"
                          color="error"
                        >
                          Delete
                        </Button>
                      </>
                    )}
                    {(request.status == 'Accepted' || request.status == 'Rejected' || request.status == 'AcceptAsIs') && (
                      <>
                        <Button
                          onClick={() =>
                            navigate('/company/requestSummary/' + request.id?.toString() + '')
                          }
                          variant="contained"
                        >
                          Check Review
                        </Button>
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
