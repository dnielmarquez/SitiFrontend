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
import { RequestCompletedListTable } from 'src/sections/dashboard/company/request-completed-list-table';
const Page = () => {
  const defaultRequest: Request = {
    // Provide default values for all fields
    createdByUserId: '',
    productName: 'VAULT',
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
          ></Stack>
          <Stack spacing={4}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">Completed Orders</Typography>
              </Stack>
            </Stack>
            <Card>
              <RequestCompletedListTable requests={requests} />
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default Page;
