import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from '@mui/material';
import { reviewRequest, updateRequest } from 'src/services/requestAPI';
import { Request } from 'src/types/request';
interface MachiningChecklistProps {
  setters: {
    setCheckingMachining: React.Dispatch<React.SetStateAction<boolean>>;
    setMachiningData: React.Dispatch<React.SetStateAction<{}>>;
    orderId: string;
    order: Request | null;
  };
}

const MachiningChecklist: React.FC<MachiningChecklistProps> = ({ setters }) => {
  const [traceabilityNumbers, setTraceabilityNumbers] = useState([
    {
      traceabilityNumber: '',
      scratches: false,
      dented: false,
      length: '',
      OD: '',
      ID: '',
      validationStatus: false,
    },
  ]);
  useEffect(() => {
    if (
      setters.order &&
      (setters.order.status == 'Repair' || setters.order.status == 'Replace') &&
      setters.order.prevReviewedMachining
    ) {
      console.log('dat', setters.order.prevReviewedMachining);
      const dat: any = setters.order.prevReviewedMachining;

      setTraceabilityNumbers(dat);
    }
  }, [setters.order]);
  const addTraceabilityNumber = () => {
    setTraceabilityNumbers((traceabilityNumbers) => [
      ...traceabilityNumbers,
      {
        traceabilityNumber: '',
        scratches: false,
        dented: false,
        length: '',
        OD: '',
        ID: '',
        validationStatus: false,
      },
    ]);
  };

  const submitData = async () => {
    // Create an object with the field 'reviewedMachining'
    const dataToSubmit = {
      reviewedMachining: traceabilityNumbers,
    };

    // Convert the object to a JSON string
    const jsonString = JSON.stringify(dataToSubmit);

    // Implement the submission logic here
    // For example, calling an update function with jsonString

    await reviewRequest(setters.orderId, jsonString, 'MACHINING');

    // Setting state and logging data (as per your current implementation)
    setters.setMachiningData({ hey: true }); // Assuming you want to keep this line
    setters.setCheckingMachining(false);
    window.location.reload();
  };

  return (
    <Box sx={{ maxWidth: '1000px', width: '100%', margin: 'auto', mt: 10, mb: 20 }}>
      <Typography
        variant="h4"
        gutterBottom
      >
        Machining Process Checklist {setters.order?.status == 'Repair' && '- To Repair'}
        {setters.order?.status == 'Replace' && '- To Replace'}
      </Typography>
      {traceabilityNumbers.map((item, index) => (
        <Box
          key={index}
          sx={{ mb: 2 }}
        >
          <Typography variant="h5">
            Traceability Number {index + 1}{' '}
            {traceabilityNumbers[index].validationStatus && ' - TN Approved'}
          </Typography>
          <TextField
            label="Traceability number"
            value={item.traceabilityNumber}
            onChange={(e) => {
              const newItems = [...traceabilityNumbers];
              newItems[index].traceabilityNumber = e.target.value;
              setTraceabilityNumbers(newItems);
            }}
            fullWidth
            margin="normal"
            disabled={
              setters.order != null &&
              setters.order.status != undefined &&
              (setters.order.status == 'Repair' || setters.order.status == 'Replace')
            }
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={item.scratches}
                  onChange={(e) => {
                    const newItems = [...traceabilityNumbers];
                    newItems[index].scratches = e.target.checked;
                    setTraceabilityNumbers(newItems);
                  }}
                />
              }
              label="Scratches"
              disabled={traceabilityNumbers[index].validationStatus}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={item.dented}
                  onChange={(e) => {
                    const newItems = [...traceabilityNumbers];
                    newItems[index].dented = e.target.checked;
                    setTraceabilityNumbers(newItems);
                  }}
                />
              }
              label="Dented"
              disabled={traceabilityNumbers[index].validationStatus}
            />
          </FormGroup>
          <TextField
            label="Length"
            value={item.length}
            onChange={(e) => {
              const newItems = [...traceabilityNumbers];
              newItems[index].length = e.target.value;
              setTraceabilityNumbers(newItems);
            }}
            fullWidth
            margin="normal"
            type="number"
            inputProps={{ step: '0.01' }}
            disabled={traceabilityNumbers[index].validationStatus}
          />
          <TextField
            label="OD"
            value={item.OD}
            onChange={(e) => {
              const newItems = [...traceabilityNumbers];
              newItems[index].OD = e.target.value;
              setTraceabilityNumbers(newItems);
            }}
            fullWidth
            margin="normal"
            type="number"
            inputProps={{ step: '0.01' }}
            disabled={traceabilityNumbers[index].validationStatus}
          />
          <TextField
            label="ID"
            value={item.ID}
            onChange={(e) => {
              const newItems = [...traceabilityNumbers];
              newItems[index].ID = e.target.value;
              setTraceabilityNumbers(newItems);
            }}
            fullWidth
            margin="normal"
            type="number"
            inputProps={{ step: '0.01' }}
            disabled={traceabilityNumbers[index].validationStatus}
          />
          {/* Add Outer Diameter and Inner Diameter fields similarly */}
        </Box>
      ))}
      {setters.order && setters.order.status != 'Repair' && setters.order.status != 'Replace' && (
        <Button
          variant="contained"
          onClick={addTraceabilityNumber}
          sx={{ mr: 2 }}
        >
          Add New Traceability Number
        </Button>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={submitData}
      >
        Submit Data for Review
      </Button>
    </Box>
  );
};

export default MachiningChecklist;
