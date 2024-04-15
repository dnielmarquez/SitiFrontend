import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRequestById, updateRequest, verifyRequest } from 'src/services/requestAPI';
import { Request } from 'src/types/request';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  List,
  ListItem,
  ListItemText,
  Grid,
  Button,
} from '@mui/material';
import MachiningChecklist from './machiningChecklist';
import CoatingChecklist from './coatingChecklist';
import { useUser } from 'src/contexts/user/userContext';
import { getUserById } from 'src/services/userAPI';

const SupplierChecklist = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Request | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkingMachining, setCheckingMachining] = useState(false);
  const [machiningData, setMachiningData] = useState<{} | null>(null);
  const [coatingData, setCoatingData] = useState<{} | null>(null);
  const [checkingCoating, setCheckingCoating] = useState(false);
  const [systemReviewData, setSystemReviewData] = useState();
  const [allCoatingValidated, setAllCoatingValidated] = useState<boolean>(false);
  const [allMachiningValidated, setAllMachiningValidated] = useState<boolean>(false);

  const { token } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    const getOrderData = async () => {
      try {
        if (orderId) {
          const orderData = await getRequestById(orderId);
          const orderDataFixed = { ...orderData };
          console.log(orderData);
          orderDataFixed.productRequirements = JSON.parse(orderDataFixed.productRequirements);
          if (orderDataFixed.systemReview) {
            const systemReviewJson = JSON.parse(orderDataFixed.systemReview);
            setSystemReviewData(systemReviewJson);
            // Check all machining validationStatus
            const allMachiningValidated = systemReviewJson.machiningValidation.every(
              (item: any) => item.validationStatus === true
            );
            setAllMachiningValidated(allMachiningValidated);
            // Check all coating validationStatus
            const allCoatingValidated = systemReviewJson.coatingValidation.every((batch: any) =>
              batch.samples.every((sample: any) => sample.validationStatus === true)
            );
            setAllCoatingValidated(allCoatingValidated);
          }
          setOrder(orderDataFixed);
        } else {
          setError('Order ID not provided');
        }
      } catch (e) {
        setError('Failed to fetch order data');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    getOrderData();
  }, [orderId]);

  const sendReview = async () => {
    if (orderId) {
      const data: Request = {
        status: 'ReadyToAcceptance',
      };
      const verifying = await verifyRequest(orderId, data, token);
      if (verifying.systemReview) {
        navigate('/supplier/dashboard');
      } else {
        alert('Something went wrong, try again!');
      }
    }
  };

  const renderProductRequirements = (productRequirements: {}) => {
    const entries = Object.entries(productRequirements);
    const half = Math.ceil(entries.length / 2);
    const firstColumnEntries = entries.slice(0, half);
    const secondColumnEntries = entries.slice(half);

    return (
      <Grid
        container
        spacing={2}
      >
        <Grid
          item
          xs={6}
        >
          {firstColumnEntries.map(([key, value]) => (
            <Typography key={key}>{`${key}: ${value}`}</Typography>
          ))}
        </Grid>
        <Grid
          item
          xs={6}
        >
          {secondColumnEntries.map(([key, value]) => (
            <Typography key={key}>{`${key}: ${value}`}</Typography>
          ))}
        </Grid>
      </Grid>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {!checkingMachining && !checkingCoating && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ ml: 10 }}
        >
          <Card raised>
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                gutterBottom
              >
                Order Details
              </Typography>
              <Typography
                variant="h6"
                color="text.secondary"
              >
                Order ID: {order?.id}
              </Typography>
              <TableContainer component={Paper}>
                <Table aria-label="simple table">
                  <TableBody>
                    <TableRow>
                      <TableCell>Product Name</TableCell>
                      <TableCell>{order?.productName}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Product Requirements</TableCell>
                      <TableCell>
                        {order?.productRequirements &&
                          renderProductRequirements(order.productRequirements)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Process</TableCell>
                      <TableCell>{order?.process?.join(', ')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Assignment Date</TableCell>
                      <TableCell>{order?.assignmentDate?.split('T')[0]}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Due Date</TableCell>
                      <TableCell>{order?.dueDate?.split('T')[0]}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              {order?.process && order.process.includes('MACHINING') && (
                <Button
                  variant="contained"
                  sx={{ mt: 5 }}
                  onClick={() => setCheckingMachining(true)}
                  disabled={order?.reviewedMachining != null && order?.reviewedMachining != ''}
                >
                  Check Machining
                </Button>
              )}
              {order?.process && order.process.includes('COATING') && (
                <Button
                  variant="contained"
                  sx={{ mt: 5, ml: 2 }}
                  onClick={() => setCheckingCoating(true)}
                  disabled={order?.reviewedCoating != null && order?.reviewedCoating != ''}
                >
                  Check Coating
                </Button>
              )}
              {((order?.reviewedMachining != '' &&
                order?.reviewedMachining != null &&
                order?.reviewedCoating != '') ||
                !order?.process?.includes('MACHINING')) &&
                ((order?.reviewedCoating != '' &&
                  order?.reviewedCoating != null &&
                  order?.reviewedCoating != '') ||
                  !order?.process?.includes('COATING')) && (
                  <Button
                    variant="contained"
                    sx={{ mt: 5, ml: 2 }}
                    onClick={sendReview}
                  >
                    Send Checklist
                  </Button>
                )}
            </CardContent>
          </Card>
        </Box>
      )}
      {checkingMachining && !checkingCoating && (
        <MachiningChecklist
          setters={{
            setCheckingMachining: setCheckingMachining,
            setMachiningData: setMachiningData,
            orderId: orderId || '',
            order: order,
          }}
        ></MachiningChecklist>
      )}
      {checkingCoating && !checkingMachining && (
        <CoatingChecklist
          setters={{
            setCheckingCoating: setCheckingCoating,
            setCoatingData: setCoatingData,
            orderId: orderId || '',
            order: order,
          }}
        ></CoatingChecklist>
      )}
    </>
  );
};

export default SupplierChecklist;
