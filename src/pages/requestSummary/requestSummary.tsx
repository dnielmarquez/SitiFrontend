import React, { useEffect, useState } from 'react';
import {
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Divider,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Box } from '@mui/system';
import { useNavigate, useParams } from 'react-router';
import {
  getRequestById,
  updateRequest,
  updateRequestWithToken,
  uploadToBlockchain,
} from 'src/services/requestAPI';
import { Request } from 'src/types/request';
import { getUserById } from 'src/services/userAPI';
import JsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { useUser } from 'src/contexts/user/userContext';
import { overflowWrap } from 'html2canvas/dist/types/css/property-descriptors/overflow-wrap';

const RequestSummary = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>();
  const [supplierData, setSupplierData] = useState<Supplier | null>(null);
  const [openAcceptAsIsPopup, setOpenAcceptAsIsPopup] = useState<boolean>(false);
  const [openReplaceRepairIsPopup, setOpenReplaceRepairIsPopup] = useState<boolean>(false);
  const [newDueDateState, setNewDueDateState] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [uploadingBlockchain, setUploadingBlockchain] = useState<boolean>(false);
  const [replaceOrRepair, setReplaceOrRepair] = useState('Replace');

  const navigate = useNavigate();
  const { token } = useUser();

  useEffect(() => {
    const getOrderData = async () => {
      try {
        if (orderId) {
          const orderData = await getRequestById(orderId);
          const orderDataFixed = { ...orderData };
          orderDataFixed.productRequirements = JSON.parse(orderDataFixed.productRequirements);
          orderDataFixed.systemReview = JSON.parse(orderDataFixed.systemReview);
          console.log(orderDataFixed);
          setOrder(orderDataFixed);
        } else {
          alert('No order id selected');
        }
      } catch (e) {
        alert('Failed to fetch order data');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    getOrderData();
  }, [orderId]);

  useEffect(() => {
    if (order) {
      const getSupplierData = async () => {
        try {
          if (order?.supplierThatChecked) {
            const supplierData = await getUserById(order?.supplierThatChecked);
            console.log(supplierData);
            setSupplierData(supplierData);
          } else {
            alert('Order User not provided');
          }
        } catch (e) {
          alert('Failed to fetch user data');
          console.error(e);
        } finally {
          setLoading(false);
        }
      };

      getSupplierData();
    }
  }, [order]);

  const updateOrder = async (status: string, remarks?: string, _newDueDate?: string) => {
    try {
      if (orderId) {
        let data: Request = { status: status };
        if (status == 'AcceptAsIs') {
          if (remarks) {
            data.acceptanceRemarks = remarks;
          }
          const transaction = await updateRequestWithToken(orderId, data, token);
          navigate('/');
        }
        console.log('dat1', _newDueDate);
        if (status == 'Replace' || status == 'Repair') {
          if (_newDueDate) {
            data.dueDate = _newDueDate + 'T00:00:00.000Z';
          }
          const transaction = await updateRequest(orderId, data);
          navigate('/');
        }
      }
    } catch (error) {
      alert('there was a problem updating the order');
      window.location.reload();
    }
  };

  const printDocument = () => {
    const inputElements = document.getElementsByClassName('toPrint');
    // Iniciar un arreglo para guardar las alturas de los elementos
    let elementHeights: number[] = [];

    // Mapear cada inputElement a una promesa que resuelve su altura
    const canvasPromises = Array.from(inputElements).map((inputElement) =>
      html2canvas(inputElement as HTMLElement, {
        useCORS: true,
        scale: 1,
        logging: true,
        width: inputElement.clientWidth,
      }).then((canvas) => {
        // Guardar la altura del elemento en el arreglo
        elementHeights.push(canvas.height);
        return canvas;
      })
    );

    // Cuando todas las promesas se han resuelto, continuar con la creación del PDF
    Promise.all(canvasPromises)
      .then((canvases) => {
        // Sumar todas las alturas de los elementos para obtener la altura total de la página PDF
        const totalHeight = elementHeights.reduce((sum, height) => sum + height, 0);
        console.log('totalHeight', totalHeight);
        // Ancho fijo para el PDF, usualmente el ancho de una página A4 en píxeles
        const pdfWidth = 1200;

        // Crear una nueva instancia de jsPDF con el alto total y el ancho fijo
        const pdf = new JsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [pdfWidth, totalHeight],
        });

        // Posición vertical inicial para las imágenes en el PDF
        let yPos = 0;

        // Añadir cada imagen al PDF en la posición correspondiente
        canvases.forEach((canvas, index) => {
          const imgData = canvas.toDataURL('image/png');
          // Escalar la imagen proporcionalmente al ancho del PDF
          const widthRatio = pdfWidth / canvas.width;
          const scaledHeight = canvas.height * widthRatio;

          // Añadir imagen al PDF en la posición calculada
          pdf.addImage(imgData, 'PNG', 0, yPos, pdfWidth, scaledHeight);
          yPos += scaledHeight; // Actualizar la posición vertical para la siguiente imagen
        });

        // Guardar el PDF con un nombre de archivo
        pdf.save('download.pdf');
      })
      .catch((error) => {
        console.error('Error al generar el PDF: ', error);
      });
  };

  const uploadPDFToBlockchain = () => {
    setUploadingBlockchain(true);
    const inputElements = document.getElementsByClassName('toPrint');
    // Iniciar un arreglo para guardar las alturas de los elementos
    let elementHeights: number[] = [];

    // Mapear cada inputElement a una promesa que resuelve su altura
    const canvasPromises = Array.from(inputElements).map((inputElement) =>
      html2canvas(inputElement as HTMLElement, {
        useCORS: true,
        scale: 1,
        logging: true,
        width: inputElement.clientWidth,
      }).then((canvas) => {
        // Guardar la altura del elemento en el arreglo
        elementHeights.push(canvas.height);
        return canvas;
      })
    );

    Promise.all(canvasPromises)
      .then((canvases) => {
        // Sumar todas las alturas de los elementos para obtener la altura total de la página PDF
        const totalHeight = elementHeights.reduce((sum, height) => sum + height, 0);
        console.log('totalHeight', totalHeight);
        // Ancho fijo para el PDF, usualmente el ancho de una página A4 en píxeles
        const pdfWidth = 1200;

        // Crear una nueva instancia de jsPDF con el alto total y el ancho fijo
        const pdf = new JsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [pdfWidth, totalHeight],
        });

        // Posición vertical inicial para las imágenes en el PDF
        let yPos = 0;

        // Añadir cada imagen al PDF en la posición correspondiente
        canvases.forEach((canvas, index) => {
          const imgData = canvas.toDataURL('image/png');
          // Escalar la imagen proporcionalmente al ancho del PDF
          const widthRatio = pdfWidth / canvas.width;
          const scaledHeight = canvas.height * widthRatio;

          // Añadir imagen al PDF en la posición calculada
          pdf.addImage(imgData, 'PNG', 0, yPos, pdfWidth, scaledHeight);
          yPos += scaledHeight; // Actualizar la posición vertical para la siguiente imagen
        });

        const pdfBlob = pdf.output('blob'); // Obtenemos el blob directamente
        console.log('pdf', pdfBlob);
        uploadPDFBlob(pdfBlob); // Llamamos a la función para subir el Blob
      })
      .catch((error) => {
        console.error('Error al generar el PDF: ', error);
      });
  };
  const uploadPDFBlob = async (pdfBlob: Blob) => {
    const formData = new FormData();
    formData.append('file', pdfBlob, 'generated.pdf');
    console.log(formData.get('file')); // Debería mostrar el Blob si se ha añadido correctamente.

    if (orderId) {
      const tx = await uploadToBlockchain(orderId, formData);
      window.location.reload();
    }
  };
  return (
    <>
      <Dialog
        open={openAcceptAsIsPopup}
        onClose={() => setOpenAcceptAsIsPopup(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography variant="h5">Set Acceptance Remarks</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            As you are accepting this order as is, please give some acceptance remarks to it.
          </DialogContentText>
          <TextField
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            label="Acceptance Remarks"
            sx={{ mt: 2 }}
            value={remarks}
            onChange={(event) => setRemarks(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAcceptAsIsPopup(false)}>Cancel</Button>
          <Button
            onClick={() => updateOrder('AcceptAsIs', remarks)}
            autoFocus
            variant="contained"
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openReplaceRepairIsPopup}
        onClose={() => setOpenReplaceRepairIsPopup(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography variant="h5">Set New Due Date</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please give a New Due Date for this order.
          </DialogContentText>
          <TextField
            type="date"
            variant="outlined"
            fullWidth
            label="Due Date"
            sx={{ mt: 2 }}
            value={newDueDateState}
            onChange={(event) => setNewDueDateState(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReplaceRepairIsPopup(false)}>Cancel</Button>
          <Button
            onClick={() => updateOrder(replaceOrRepair, '', newDueDateState)}
            autoFocus
            variant="contained"
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>

      <div id="pdfContainer">
        <Typography
          variant="h3"
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ ml: 10, mr: 10 }}
        >
          Order Overall Status:
          <Typography
            component="span"
            variant="h3"
            color={order?.status == 'Rejected' ? 'red' : 'green'}
          >
            {order?.status}
          </Typography>
        </Typography>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ ml: 10, mr: 10, mt: 5 }}
        >
          <Grid
            container
            justifyContent="space-between"
          >
            <Grid
              item
              xs={6}
              container
              justifyContent="flex-start"
            >
              {order?.status == 'Rejected' && (
                <>
                  <Button
                    variant="contained"
                    onClick={() => {
                      setOpenAcceptAsIsPopup(true);
                    }}
                  >
                    Accept As Is
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ ml: 2 }}
                    onClick={() => {
                      setReplaceOrRepair('Repair');
                      setOpenReplaceRepairIsPopup(true);
                    }}
                  >
                    Repair
                  </Button>
                  <Button
                    variant="contained"
                    sx={{ ml: 2 }}
                    onClick={() => {
                      setReplaceOrRepair('Replace');
                      setOpenReplaceRepairIsPopup(true);
                    }}
                  >
                    Replace
                  </Button>
                </>
              )}
            </Grid>
            <Grid
              item
              xs={6}
              container
              justifyContent="flex-end"
            >
              {(order?.status == 'AcceptAsIs' || order?.status == 'Accepted') && (
                <>
                  <Button
                    variant="contained"
                    sx={{ ml: 2 }}
                    onClick={printDocument}
                  >
                    Download PDF
                  </Button>
                  {!order?.blockchainTx &&
                    (order?.status === 'Accepted' || order?.status === 'AcceptAsIs') &&
                    (uploadingBlockchain ? (
                      <Button
                        variant="contained"
                        sx={{ ml: 2 }}
                        disabled
                      >
                        Uploading...
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        sx={{ ml: 2 }}
                        onClick={uploadPDFToBlockchain}
                      >
                        Upload to Blockchain
                      </Button>
                    ))}
                  {order?.blockchainTx && (
                    <Button
                      variant="contained"
                      sx={{ ml: 2 }}
                      onClick={() =>
                        window.open(
                          'https://testnet.bscscan.com/tx/' + order.blockchainTx,
                          '_blank'
                        )
                      }
                    >
                      See tx on Blockchain
                    </Button>
                  )}
                  {order?.fileOnchainHash && (
                    <Button
                      variant="contained"
                      sx={{ ml: 2 }}
                      onClick={() =>
                        window.open('https://ipfs.io/ipfs/' + order.fileOnchainHash, '_blank')
                      }
                    >
                      See PDF
                    </Button>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </Box>
        {order?.process.includes('MACHINING') && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ ml: 10, mr: 10, mt: 3 }}
          >
            <Paper
              style={{ padding: 16 }}
              sx={{ width: '100%' }}
            >
              <Typography
                variant="h5"
                sx={{ mb: 3 }}
              >
                Machining Report
              </Typography>
              <Typography variant="body1">Order Id: {orderId}</Typography>
              <Typography variant="body1">Product Quantity: {order?.quantity}</Typography>
              <Typography variant="body1">Product Name: {order?.productName}</Typography>
              <Typography variant="body1">
                Process:{' '}
                {order?.process &&
                  (order?.process.length > 1 ? order?.process.join(', ') : order?.process.join(''))}
              </Typography>
              <Typography variant="body1">Supplier Name: {supplierData?.supplierName}</Typography>
              <Typography variant="body1">
                Supplier Employee Name: {supplierData?.employeeName}
              </Typography>
              <Typography variant="body1">
                Supplier Employee Position: {supplierData?.position}
              </Typography>
              <Typography variant="body1">
                Date Data Submitted:{' '}
                {order?.dateChecked
                  ? new Date(order.dateChecked).toLocaleString()
                  : 'Not Available'}
              </Typography>
              <Typography
                variant="body1"
                sx={{ mt: 2 }}
              >
                Product Requirements:{' '}
                {order?.productRequirements &&
                  'LengthMin: ' +
                    order?.productRequirements.LengthMin +
                    ' - LengthMax: ' +
                    order?.productRequirements.LengthMax +
                    ' - ODMin: ' +
                    order?.productRequirements.ODMin +
                    ' - ODMax: ' +
                    order?.productRequirements.ODMax +
                    ' - IDMin: ' +
                    order?.productRequirements.IDMin +
                    ' - IDMax: ' +
                    order?.productRequirements.IDMax +
                    ' - Scratches: ' +
                    order?.productRequirements.Scratches +
                    ' - Dented: ' +
                    order?.productRequirements.Dented +
                    ''}
              </Typography>

              <TableContainer
                component={Paper}
                style={{ marginTop: 16 }}
              >
                <Table aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Traceability Number</TableCell>
                      <TableCell align="left">Visual Details</TableCell>
                      <TableCell align="left">Dimension Details</TableCell>
                      <TableCell align="left">Comments</TableCell>
                      <TableCell align="left">Verification Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order &&
                      order?.systemReview?.machiningValidation?.map((row: any) => (
                        <TableRow key={row.traceabilityNumber}>
                          <TableCell
                            component="th"
                            scope="row"
                          >
                            {row.traceabilityNumber}
                          </TableCell>
                          <TableCell align="left">
                            Scratches: {row.scratches ? 'Yes' : 'No'}, Dented:{' '}
                            {row.dented ? 'Yes' : 'No'}
                          </TableCell>
                          <TableCell align="left">{`L: ${row.length} - OD: ${row.OD} - ID: ${row.ID}`}</TableCell>
                          <TableCell align="left">{row.comments}</TableCell>
                          <TableCell align="left">
                            {row.validationStatus ? 'Approved' : 'Rejected'}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* ... Other sections such as coating validation */}

              <Paper
                variant="outlined"
                square
                style={{ marginTop: 16, padding: 16 }}
              >
                <div>
                  {order?.acceptanceRemarks && 'Acceptance remarks: ' + order?.acceptanceRemarks}
                </div>
                <div>{order?.acceptedBy && 'Accepted by: ' + order?.acceptedBy}</div>
                <div>
                  {order?.dateAccepted &&
                    'Date Accepted: ' + new Date(order.dateAccepted).toLocaleString()}
                </div>
              </Paper>
            </Paper>
          </Box>
        )}
        {order?.process.includes('COATING') && (
          <>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              sx={{ ml: 10, mr: 10, mt: 5 }}
            >
              <Paper
                style={{ padding: 16 }}
                sx={{ width: '100%' }}
              >
                <Typography
                  variant="h5"
                  sx={{ mb: 3 }}
                >
                  Coating Report
                </Typography>
                <Typography variant="body1">Order Id: {orderId}</Typography>
                <Typography variant="body1">Product Quantity: {order?.quantity}</Typography>
                <Typography variant="body1">Product Name: {order?.productName}</Typography>
                <Typography variant="body1">
                  Process:{' '}
                  {order?.process &&
                    (order?.process.length > 1
                      ? order?.process.join(', ')
                      : order?.process.join(''))}
                </Typography>
                <Typography variant="body1">Supplier Name: {supplierData?.supplierName}</Typography>
                <Typography variant="body1">
                  Supplier Employee Name: {supplierData?.employeeName}
                </Typography>
                <Typography variant="body1">
                  Supplier Employee Position: {supplierData?.position}
                </Typography>
                <Typography variant="body1">
                  Date Data Submitted:{' '}
                  {order?.dateChecked
                    ? new Date(order.dateChecked).toLocaleString()
                    : 'Not Available'}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ mt: 2 }}
                >
                  Product Requirements:{' '}
                  {order?.productRequirements &&
                    'ThicknessMin: ' +
                      order?.productRequirements.ThicknessMin +
                      ' - ThicknessMax: ' +
                      order?.productRequirements.ThicknessMax +
                      ' - Porosity: ' +
                      order?.productRequirements.Porosity +
                      ''}
                </Typography>
                {/* ... other input fields */}

                <TableContainer
                  component={Paper}
                  style={{ marginTop: 16 }}
                >
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Batch Number</TableCell>
                        <TableCell>Traceability Number</TableCell>
                        <TableCell align="left">Sample Visual Details</TableCell>
                        <TableCell align="left">Sample Dimension Details</TableCell>
                        <TableCell align="left">Comments</TableCell>
                        <TableCell align="left">Verification Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order &&
                        order?.systemReview?.coatingValidation?.map((row: any) => (
                          <TableRow key={row.batchNumber}>
                            <TableCell
                              component="th"
                              scope="row"
                            >
                              {row.batchNumber}
                            </TableCell>
                            <TableCell
                              component="th"
                              scope="row"
                            >
                              {row.traceabilityNumbers?.map((trace: any, indexTrace: number) => (
                                <>
                                  <Divider sx={{ mt: 2, mb: 2 }}></Divider>
                                  <React.Fragment key={indexTrace}>
                                    {trace}
                                    <br />
                                  </React.Fragment>
                                  <Divider sx={{ mt: 2, mb: 2 }}></Divider>
                                </>
                              ))}
                            </TableCell>
                            <TableCell align="left">
                              {row.samples?.map((sample: any, indexSample: number) => (
                                <>
                                  <Divider sx={{ mt: 2, mb: 2 }}></Divider>
                                  <React.Fragment key={indexSample}>
                                    Porosity: {sample.porosity ? 'Yes' : 'No'}
                                    <br />
                                  </React.Fragment>
                                  <Divider sx={{ mt: 2, mb: 2 }}></Divider>
                                </>
                              ))}
                            </TableCell>
                            <TableCell align="left">
                              {row.samples?.map((sample: any, indexSampleThick: number) => (
                                <>
                                  <Divider sx={{ mt: 2, mb: 2 }}></Divider>
                                  <React.Fragment key={indexSampleThick}>
                                    Thickness: {sample.thickness}
                                    <br />
                                  </React.Fragment>
                                  <Divider sx={{ mt: 2, mb: 2 }}></Divider>
                                </>
                              ))}
                            </TableCell>
                            <TableCell align="left">
                              {row.samples?.map((sample: any, indexSampleComment: number) => (
                                <>
                                  <Divider sx={{ mt: 2, mb: 2 }}></Divider>
                                  <React.Fragment key={indexSampleComment}>
                                    {sample.comments}
                                    <br />
                                  </React.Fragment>
                                  <Divider sx={{ mt: 2, mb: 2 }}></Divider>
                                </>
                              ))}
                            </TableCell>
                            <TableCell align="left">
                              {row.samples?.map((sample: any, indexSampleValid: number) => (
                                <>
                                  <Divider sx={{ mt: 2, mb: 2 }}></Divider>
                                  <React.Fragment key={indexSampleValid}>
                                    {sample.validationStatus ? 'Approved' : 'Rejected'}
                                    <br />
                                  </React.Fragment>
                                  <Divider sx={{ mt: 2, mb: 2 }}></Divider>
                                </>
                              ))}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* ... Other sections such as coating validation */}

                <Paper
                  variant="outlined"
                  square
                  style={{ marginTop: 16, padding: 16 }}
                >
                  <div>
                    {order?.acceptanceRemarks && 'Acceptance remarks: ' + order?.acceptanceRemarks}
                  </div>
                  <div>{order?.acceptedBy && 'Accepted by: ' + order?.acceptedBy}</div>
                  <div>
                    {order?.dateAccepted &&
                      'Date Accepted: ' + new Date(order.dateAccepted).toLocaleString()}
                  </div>
                </Paper>
              </Paper>
            </Box>
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="left"
              alignItems="left"
              sx={{ ml: 10, mr: 10, mt: 5 }}
            >
              {order.reviewedCoating.map((coating: any, coatingIndex: any) => (
                <Box
                  key={coatingIndex}
                  sx={{ width: '100%', mb: 5 }} // Ensure the width of the box is 100% to use the full container width
                >
                  <Typography
                    variant="h5"
                    align="left"
                  >
                    Batch Number: {coating.batchNumber}
                  </Typography>
                  {coating.samples.map((sample: any, sampleIndex: any) => (
                    <Box
                      key={sampleIndex}
                      sx={{ mt: 3, mb: 3 }}
                    >
                      <Typography
                        variant="subtitle1"
                        align="left"
                      >
                        Sample {sampleIndex + 1}
                      </Typography>
                      <Grid
                        container
                        spacing={2}
                        justifyContent="left" // This ensures that the grid items are centered in the container
                      >
                        {sample.photos.map((photo: any, photoIndex: any) => (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={4}
                            key={photoIndex}
                            sx={{ display: 'flex', justifyContent: 'left' }} // Center the image within the grid item
                          >
                            <Box
                              component="img"
                              src={`https://mputmblkchain.online${photo}`}
                              alt={`Batch ${coating.batchNumber} Sample ${sampleIndex + 1} Photo ${
                                photoIndex + 1
                              }`}
                              sx={{ maxWidth: '100%', height: 'auto' }} // Using maxWidth to ensure the image does not overflow its container
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </>
        )}

        <Divider sx={{ mt: 10, mb: 10 }}></Divider>
      </div>
      {order?.process.includes('MACHINING') && (
        <div className="toPrint">
          <TableContainer
            component={Paper}
            sx={{
              m: '2%',
              width: '96%',
              borderRadius: 0,
              color: 'black',
              '& td, & th ': { color: 'black', backgroundColor: 'white', border: 1 },
            }}
          >
            <Table aria-label="customized table">
              <TableBody>
                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ border: 1, whiteSpace: 'nowrap', width: 'auto' }}
                  >
                    <Typography variant="h5">
                      SUPPLIER NAME: {supplierData?.supplierName}
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="h5">PRODUCT QUALITY DATA REPORT</Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer
            component={Paper}
            sx={{
              m: '2%',
              width: '96%',
              borderRadius: 0,
              '& td, & th, & table ': {
                color: 'black',
                borderColor: 'black',
                backgroundColor: 'white',
                border: 1,
              },
            }}
          >
            <Table aria-label="customized table">
              <TableBody>
                <TableRow sx={{ border: 'solid black 1px !important' }}>
                  <TableCell
                    component="th"
                    scope="row"
                    sx={{ border: 1, whiteSpace: 'nowrap', width: 'auto' }}
                  >
                    Customer Order Number
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ borderRight: '0px !important' }}
                  >
                    {orderId}
                  </TableCell>
                </TableRow>
                <TableRow sx={{ border: 'solid black 1px !important' }}>
                  <TableCell
                    component="th"
                    scope="row"
                  >
                    Product Name
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ borderRight: '0px !important' }}
                  >
                    {order?.productName}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                  >
                    Product Quantity
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ borderRight: '0px !important' }}
                  >
                    {order?.quantity}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                    rowSpan={2}
                  >
                    Product Requirements
                  </TableCell>
                  <TableCell
                    component="th"
                    scope="row"
                  >
                    Visual
                  </TableCell>
                  <TableCell
                    align="left"
                    colSpan={2}
                  >
                    Scratch: {order?.productRequirements?.Scratches ? 'Allowed' : 'Not Allowed'}
                    <br />
                    Dent: {order?.productRequirements?.Dented ? 'Allowed' : 'Not Allowed'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                  >
                    Dimension
                  </TableCell>
                  <TableCell
                    align="left"
                    colSpan={2}
                  >
                    Length: {order?.productRequirements?.LengthMin} -{' '}
                    {order?.productRequirements?.LengthMax}
                    <br />
                    OD: {order?.productRequirements?.ODMin} - {order?.productRequirements?.ODMax}
                    <br />
                    ID: {order?.productRequirements?.IDMin} - {order?.productRequirements?.IDMax}
                  </TableCell>
                </TableRow>

                <TableRow sx={{ border: 'solid black 1px !important' }}>
                  <TableCell
                    component="th"
                    scope="row"
                  >
                    Process Name
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ borderRight: '0px !important' }}
                  >
                    MACHINING
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    component="th"
                    scope="row"
                  >
                    Product Quality Data Report Number
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{ borderRight: '0px !important' }}
                  >
                    123123123
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <TableContainer
            component={Paper}
            sx={{
              m: '2%',
              width: '96%',
              borderRadius: 0,
              '& td, & th, & table ': {
                color: 'black',
                borderColor: 'black',
                backgroundColor: 'white',
                border: 1,
              },
              '& .css-1si8ysn-MuiTableRow-root': {
                border: 0,
              },
            }}
          >
            <Table aria-label="simple table">
              <TableHead
                sx={{
                  '& .MuiTableCell-head': {
                    color: 'white', // Cambia el color del texto a negro
                    backgroundColor: 'gray',
                  },
                  '& .css-1si8ysn-MuiTableRow-root': {
                    border: 'none',
                  },
                  '& th': {
                    border: 'solid 1px black',
                  },
                }}
              >
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Traceability Number</TableCell>
                  <TableCell colSpan={2}>Visual</TableCell>
                  <TableCell colSpan={3}>Dimension</TableCell>
                  <TableCell>Date Data Submitted by Supplier</TableCell>
                  <TableCell>Date Data Accepted by Company</TableCell>
                  <TableCell>Supplier Stamp</TableCell>
                  <TableCell>Company Stamp</TableCell>
                  <TableCell>Remarks (if there is any acceptance remarks from customer)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ borderTop: '0px !important' }}></TableCell>
                  <TableCell sx={{ borderTop: '0px !important' }}></TableCell>

                  {/* A continuación, las subcategorías para Visual y Dimension */}
                  <TableCell>Scratch</TableCell>
                  <TableCell>Dent</TableCell>
                  <TableCell>Length</TableCell>
                  <TableCell>OD</TableCell>
                  <TableCell>ID</TableCell>
                  {/* Dejar las demás celdas de esta fila vacías, ya que corresponden a columnas que no se subdividen */}
                  <TableCell sx={{ borderTop: '0px !important' }}></TableCell>
                  <TableCell sx={{ borderTop: '0px !important' }}></TableCell>
                  <TableCell sx={{ borderTop: '0px !important' }}></TableCell>
                  <TableCell sx={{ borderTop: '0px !important' }}></TableCell>
                  <TableCell sx={{ borderTop: '0px !important' }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {order &&
                  order?.systemReview?.machiningValidation?.map((row: any, index: number) => (
                    <TableRow key={row.traceabilityNumber}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ overflowWrap: 'anywhere' }}
                      >
                        {row.traceabilityNumber}
                      </TableCell>
                      <TableCell align="left">{row.scratches ? 'Yes' : 'No'}</TableCell>
                      <TableCell align="left">{row.dented ? 'Yes' : 'No'}</TableCell>
                      <TableCell align="left">{row.length}</TableCell>
                      <TableCell align="left">{row.OD}</TableCell>
                      <TableCell align="left">{row.ID}</TableCell>
                      <TableCell align="left">
                        {order?.dateChecked
                          ? new Date(order.dateChecked).toLocaleString()
                          : 'Not Available'}
                      </TableCell>
                      <TableCell align="left">
                        {order?.dateAccepted && new Date(order.dateAccepted).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {supplierData?.employeeName}

                        <Typography variant="body1">{supplierData?.position}</Typography>
                      </TableCell>
                      <TableCell>
                        {order?.acceptedBy}
                        <Typography variant="body1">{order?.acceptedByPosition}</Typography>
                      </TableCell>
                      <TableCell align="left">{order?.acceptanceRemarks}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
      {order?.process.includes('COATING') && (
        <>
          <div className="toPrint">
            <TableContainer
              component={Paper}
              sx={{
                m: '2%',
                width: '96%',
                borderRadius: 0,
                color: 'black',
                '& td, & th ': { color: 'black', backgroundColor: 'white', border: 1 },
              }}
            >
              <Table aria-label="customized table">
                <TableBody>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ border: 1, whiteSpace: 'nowrap', width: 'auto' }}
                    >
                      <Typography variant="h5">
                        SUPPLIER NAME: {supplierData?.supplierName}
                      </Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="h5">PRODUCT QUALITY DATA REPORT</Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <TableContainer
              component={Paper}
              sx={{
                m: '2%',
                width: '96%',
                borderRadius: 0,
                '& td, & th, & table ': {
                  color: 'black',
                  borderColor: 'black',
                  backgroundColor: 'white',
                  border: 1,
                },
              }}
            >
              <Table aria-label="customized table">
                <TableBody>
                  <TableRow sx={{ border: 'solid black 1px !important' }}>
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ border: 1, whiteSpace: 'nowrap', width: 'auto' }}
                    >
                      Customer Order Number
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ border: '0px !important' }}
                    >
                      {orderId}
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ border: 'solid black 1px !important' }}>
                    <TableCell
                      component="th"
                      scope="row"
                    >
                      Product Name
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ border: '0px !important' }}
                    >
                      {order?.productName}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                    >
                      Product Quantity
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ border: '0px !important' }}
                    >
                      {order?.quantity}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      rowSpan={2}
                    >
                      Product Requirements
                    </TableCell>
                    <TableCell
                      component="th"
                      scope="row"
                    >
                      Visual
                    </TableCell>
                    <TableCell
                      align="left"
                      colSpan={2}
                    >
                      Porosity: {order?.productRequirements?.Porosity ? 'Allowed' : 'Not Allowed'}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      component="th"
                      scope="row"
                    >
                      Dimension
                    </TableCell>
                    <TableCell
                      align="left"
                      colSpan={2}
                    >
                      Coating Thickness: {order?.productRequirements?.ThicknessMin} -{' '}
                      {order?.productRequirements?.ThicknessMax}
                    </TableCell>
                  </TableRow>

                  <TableRow sx={{ border: 'solid black 1px !important' }}>
                    <TableCell
                      component="th"
                      scope="row"
                    >
                      Process Name
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ border: '0px !important' }}
                    >
                      COATING
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ border: 'solid black 1px !important' }}>
                    <TableCell
                      component="th"
                      scope="row"
                    >
                      Product Quality Data Report Number
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{ border: '0px !important' }}
                    >
                      123123123
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <TableContainer
              component={Paper}
              sx={{
                m: '2%',
                width: '96%',
                borderRadius: 0,
                '& td, & th, & table ': {
                  color: 'black',
                  borderColor: 'black',
                  backgroundColor: 'white',
                  border: 1,
                },
                '& .css-1si8ysn-MuiTableRow-root': {
                  border: 0,
                },
              }}
            >
              <Table aria-label="simple table">
                <TableHead
                  sx={{
                    '& .MuiTableCell-head': {
                      color: 'white', // Cambia el color del texto a negro
                      backgroundColor: 'gray',
                    },
                    '& .css-1si8ysn-MuiTableRow-root': {
                      border: 'none',
                    },
                    '& th': {
                      border: 'solid 1px black',
                    },
                  }}
                >
                  <TableRow>
                    <TableCell>Batch Number</TableCell>
                    <TableCell>Traceability Number</TableCell>
                    <TableCell colSpan={1}>Visual</TableCell>
                    <TableCell colSpan={1}>Dimension</TableCell>
                    <TableCell>Date Data Submitted by Supplier</TableCell>
                    <TableCell>Date Data Accepted by Company</TableCell>
                    <TableCell>Supplier Stamp</TableCell>
                    <TableCell>Company Stamp</TableCell>
                    <TableCell>
                      Remarks (if there is any acceptance remarks from customer)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell sx={{ borderTop: '0px !important' }}></TableCell>
                    <TableCell sx={{ borderTop: '0px !important' }}></TableCell>
                    {/* A continuación, las subcategorías para Visual y Dimension */}
                    <TableCell>Porosity</TableCell>

                    <TableCell>Coating Thickness</TableCell>

                    {/* Dejar las demás celdas de esta fila vacías, ya que corresponden a columnas que no se subdividen */}
                    <TableCell sx={{ borderTop: '0px !important' }}></TableCell>
                    <TableCell sx={{ borderTop: '0px !important' }}></TableCell>
                    <TableCell sx={{ borderTop: '0px !important' }}></TableCell>
                    <TableCell sx={{ borderTop: '0px !important' }}></TableCell>
                    <TableCell sx={{ borderTop: '0px !important' }}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order &&
                    order?.systemReview?.coatingValidation?.map((row: any) => (
                      <TableRow key={row.batchNumber}>
                        <TableCell
                          component="th"
                          scope="row"
                          sx={{ overflowWrap: 'anywhere' }}
                        >
                          {row.batchNumber}
                        </TableCell>

                        <TableCell align="left">
                          <Table size="small">
                            <TableBody>
                              {row.traceabilityNumbers?.map((trace: any, indexTrace: number) => (
                                <TableRow key={indexTrace}>
                                  <TableCell
                                    align="left"
                                    sx={{ overflowWrap: 'anywhere' }}
                                  >
                                    {trace}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableCell>
                        <TableCell align="left">
                          <Table size="small">
                            <TableBody>
                              {row.samples?.map((sample: any, indexSample: number) => (
                                <TableRow key={indexSample}>
                                  <TableCell
                                    align="left"
                                    sx={{ border: 1 }}
                                  >
                                    {sample.porosity ? 'Yes' : 'No'}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableCell>
                        <TableCell align="left">
                          <Table size="small">
                            <TableBody>
                              {row.samples?.map((sample: any, indexSampleThick: number) => (
                                <TableRow key={indexSampleThick}>
                                  <TableCell
                                    align="left"
                                    sx={{ border: 1 }}
                                  >
                                    {sample.thickness}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableCell>

                        <TableCell align="left">
                          {order?.dateChecked
                            ? new Date(order.dateChecked).toLocaleString()
                            : 'Not Available'}
                        </TableCell>
                        <TableCell align="left">
                          {order?.dateAccepted && new Date(order.dateAccepted).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {supplierData?.employeeName}

                          <Typography variant="body1">{supplierData?.position}</Typography>
                        </TableCell>
                        <TableCell>
                          {order?.acceptedBy}
                          <Typography variant="body1">{order?.acceptedByPosition}</Typography>
                        </TableCell>
                        <TableCell align="left">{order?.acceptanceRemarks}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="toPrint">
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="left"
              alignItems="left"
              sx={{ width: '100%', mt: 3 }}
            >
              {order.reviewedCoating.map((coating: any, coatingIndex: any) => (
                <Box
                  key={coatingIndex}
                  sx={{ mb: 2, background: 'white', color: 'black', p: 5 }} // Ensure the width of the box is 100% to use the full container width
                >
                  <Divider></Divider>
                  <Typography
                    variant="h4"
                    align="left"
                  >
                    Attachment Group:
                  </Typography>
                  <Typography
                    variant="body1"
                    align="left"
                  >
                    Batch Number: {coating.batchNumber}
                  </Typography>
                  <Typography
                    variant="body1"
                    align="left"
                  >
                    Sample Count: {coating.samples.length}
                  </Typography>
                  <Typography
                    variant="h5"
                    align="left"
                    sx={{ mt: 3 }}
                  >
                    Images:
                  </Typography>
                  {coating.samples.map((sample: any, sampleIndex: any) => (
                    <Box
                      key={sampleIndex}
                      sx={{ mt: 1, mb: 3 }}
                    >
                      <Typography
                        variant="subtitle1"
                        align="left"
                      >
                        Sample {sampleIndex + 1}
                      </Typography>
                      <Grid
                        container
                        spacing={2}
                        justifyContent="left" // This ensures that the grid items are centered in the container
                      >
                        {sample.photos.length ? (
                          sample.photos.map((photo: any, photoIndex: any) => (
                            <Grid
                              item
                              xs={12}
                              sm={6}
                              md={4}
                              key={photoIndex}
                              sx={{ display: 'flex', justifyContent: 'left' }} // Center the image within the grid item
                            >
                              <Box
                                component="img"
                                src={`https://mputmblkchain.online${photo}`}
                                alt={`Batch ${coating.batchNumber} Sample ${
                                  sampleIndex + 1
                                } Photo ${photoIndex + 1}`}
                                sx={{ maxWidth: '100%', height: 'auto' }} // Using maxWidth to ensure the image does not overflow its container
                              />
                            </Grid>
                          ))
                        ) : (
                          <Typography
                            variant="body1"
                            sx={{ ml: 3, mt: 2 }}
                          >
                            No images for this Sample
                          </Typography>
                        )}
                      </Grid>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </div>
        </>
      )}
    </>
  );
};

export default RequestSummary;
