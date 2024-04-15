import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';

import { Seo } from 'src/components/seo';
import { usePageView } from 'src/hooks/use-page-view';
import { RequestListTable } from 'src/sections/dashboard/company/request-list-table';
import SendIcon from '@mui/icons-material/Send';
import WalletIcon from '@mui/icons-material/Wallet';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useEffect, useState } from 'react';
import { createRequest, getRequestsByCompany } from 'src/services/requestAPI';
import { useUser } from 'src/contexts/user/userContext';
import Tooltip from '@mui/material/Tooltip';
import { Chip, FormControl, InputLabel, MenuItem, Modal, Select, TextField } from '@mui/material';
import { fetchAllSuppliers } from 'src/services/userAPI';
import type { Request } from 'src/types/request';
const Page = () => {
  const defaultRequest: Request = {
    // Provide default values for all fields
    createdByUserId: '',
    productName: 'VAULT',
    quantity: 0,
    productRequirements: '',
    process: [],
    assignedSupplierIds: [],
    assignmentDate: '',
    dueDate: '',
  };

  const [requests, setRequests] = useState<Request[] | []>([]);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipTitle, setTooltipTitle] = useState('Copy to clipboard');
  const [isPressed, setIsPressed] = useState(false);
  const { userId } = useUser();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newRequest, setCurrentRequest] = useState(defaultRequest); // Using the same defaultRequest structure
  const [allSuppliers, setAllSuppliers] = useState<{ id: string; supplierName: string }[]>([]);
  usePageView();
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const suppliers = await fetchAllSuppliers(); // This should fetch users with role SUPPLIER
        setAllSuppliers(suppliers);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };
    console.log('COMPANY', userId);
    loadSuppliers();
  }, []);
  useEffect(() => {
    if (requests.length === 0 && userId) {
      fetchAllRequests();
    }
  }, [userId]);
  const [dynamicProductRequirements, setDynamicProductRequirements] = useState<any[]>([]);

  const handleNewRequestClick = () => {
    setCurrentRequest(defaultRequest); // Reset the form to default values
    setCreateModalOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('Text copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };
  const handleCreate = async () => {
    try {
      let reqToSend = { ...newRequest };

      // Format dates to ISO 8601
      reqToSend.assignmentDate = reqToSend.assignmentDate
        ? reqToSend.assignmentDate + 'T00:00:00.000Z'
        : null;
      reqToSend.dueDate = reqToSend.dueDate ? reqToSend.dueDate + 'T00:00:00.000Z' : null;

      // Manually map dynamic fields to the productRequirements JSON
      const productRequirements: Record<string, any> = {};

      dynamicProductRequirements.forEach((field) => {
        productRequirements[field.name] = field.value;
      });
      reqToSend.createdByUserId = userId;
      reqToSend.productRequirements = JSON.stringify(productRequirements);
      console.log('OBJSENT', reqToSend);
      await createRequest(reqToSend);
      setCreateModalOpen(false);
      fetchAllRequests(); // Reload the list of requests
    } catch (error) {
      console.error('Error creating new order:', error);
    }
  };

  const handleCopy = () => {
    setTooltipTitle('Card copied!');
    setTooltipOpen(true);

    setTimeout(() => {
      setTooltipOpen(false);
      // Reset tooltip after it's hidden
      setTimeout(() => setTooltipTitle('Copy to clipboard'), 500);
    }, 2000); // hide tooltip after 2 seconds
  };

  const fetchAllRequests = async () => {
    try {
      console.log('SENDING', userId);
      const result = await getRequestsByCompany(userId);
      setRequests(result);
    } catch (error) {
      console.error('Error fetching orders', error);
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
  // Function to render dynamic product requirement fields based on selected processes
  // Function to render dynamic product requirement fields based on selected processes
  const renderDynamicFields = () => {
    const selectedProcesses = newRequest?.process || [];
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
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
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
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </Select>
                </FormControl>
              </div>
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
                </FormControl>
              </div>
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
                      label="OD Min (mm)"
                      type="number"
                      value={
                        dynamicProductRequirements.find((field) => field.name === 'ODMin')?.value ||
                        ''
                      }
                      onChange={(e) => handleDynamicFieldChange('ODMin', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="OD Max (mm)"
                      type="number"
                      value={
                        dynamicProductRequirements.find((field) => field.name === 'ODMax')?.value ||
                        ''
                      }
                      onChange={(e) => handleDynamicFieldChange('ODMax', e.target.value)}
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
                  <Box
                    display="flex"
                    gap={2}
                  >
                    <TextField
                      label="ID Min (mm)"
                      type="number"
                      value={
                        dynamicProductRequirements.find((field) => field.name === 'IDMin')?.value ||
                        ''
                      }
                      onChange={(e) => handleDynamicFieldChange('IDMin', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="ID Max (mm)"
                      type="number"
                      value={
                        dynamicProductRequirements.find((field) => field.name === 'IDMax')?.value ||
                        ''
                      }
                      onChange={(e) => handleDynamicFieldChange('IDMax', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                  </Box>
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
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
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
    <>
      <Seo title="Dashboard" />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Modal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          aria-labelledby="create-request-modal"
          aria-describedby="create-request-modal-description"
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
              Create New Order
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
                  value={newRequest?.productName || defaultRequest.productName}
                  label="Product Name"
                  onChange={(e) =>
                    setCurrentRequest({
                      ...defaultRequest,
                      ...newRequest,
                      productName: e.target.value as 'VAULT' | 'COVER',
                    })
                  }
                >
                  <MenuItem value="VAULT">VAULT</MenuItem>
                  <MenuItem value="COVER">COVER</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Quantity"
                type="number"
                value={newRequest?.quantity}
                onChange={(e) =>
                  setCurrentRequest({
                    ...defaultRequest,
                    ...newRequest,
                    quantity: Number(e.target.value),
                  })
                }
                sx={{ flex: 1 }}
              />
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
                  value={newRequest?.process || []}
                  onChange={(e) =>
                    setCurrentRequest({
                      ...(newRequest || defaultRequest),
                      process: e.target.value as string[],
                    })
                  }
                  renderValue={(selected: string[]) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {newRequest.process &&
                        newRequest.process.map((value) => {
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
                  value={newRequest?.assignedSupplierIds || []}
                  onChange={(e) =>
                    setCurrentRequest({
                      ...(newRequest || defaultRequest),
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
                value={newRequest?.assignmentDate?.split('T')[0] || ''}
                onChange={(e) =>
                  setCurrentRequest({
                    ...(newRequest || defaultRequest),
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
                value={newRequest?.dueDate?.split('T')[0] || ''}
                onChange={(e) =>
                  setCurrentRequest({
                    ...(newRequest || defaultRequest),
                    dueDate: e.target.value,
                  })
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {/* Save Button */}
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleCreate}
              >
                Create
              </Button>
            </Box>
          </Box>
        </Modal>
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
              <Tooltip
                title={tooltipTitle}
                open={tooltipOpen}
                placement="top"
              >
                <SvgIcon
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.1s',
                    transform: isPressed ? 'scale(0.9)' : 'scale(1)',
                  }}
                  onClick={handleCopy}
                  onMouseDown={() => setIsPressed(true)}
                  onMouseUp={() => setIsPressed(false)}
                  onMouseLeave={() => setIsPressed(false)} // Reset in case of drag
                >
                  <ContentCopyIcon />
                </SvgIcon>
              </Tooltip>

              <SvgIcon>
                <WalletIcon />
              </SvgIcon>
            </Stack>
          </Stack>
          <Stack spacing={4}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">Company Dashboard</Typography>
              </Stack>
              <Stack
                alignItems="center"
                direction="row"
                spacing={3}
              >
                <Button
                  startIcon={
                    <SvgIcon>
                      <SendIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  onClick={handleNewRequestClick}
                >
                  New Order
                </Button>
              </Stack>
            </Stack>
            <Card>
              <RequestListTable requests={requests} />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
