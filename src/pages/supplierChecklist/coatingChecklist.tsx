import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  Divider,
  Checkbox,
  FormControlLabel,
  Grid,
} from '@mui/material';
import { reviewRequest, uploadImages } from 'src/services/requestAPI';
import { Request } from 'src/types/request';

interface Batch {
  batchNumber: string;
  traceabilityNumbers: string[];
  samples: Sample[];
}
interface Sample {
  porosity: boolean;
  thickness: number;
  photos: File[];
  validationStatus: boolean;
}
interface CoatingChecklistProps {
  setters: {
    setCheckingCoating: React.Dispatch<React.SetStateAction<boolean>>;
    setCoatingData: React.Dispatch<React.SetStateAction<{}>>;
    orderId: string;
    order: Request | null;
  };
}
const CoatingChecklist: React.FC<CoatingChecklistProps> = ({ setters }) => {
  const [batches, setBatches] = useState<Batch[]>([
    {
      batchNumber: '',
      traceabilityNumbers: [''],
      samples: [{ porosity: false, thickness: 0, photos: [], validationStatus: false }],
    },
  ]);
  useEffect(() => {
    if (
      setters.order &&
      (setters.order.status == 'Repair' || setters.order.status == 'Replace') &&
      setters.order.prevReviewedCoating
    ) {
      console.log('dat', setters.order.prevReviewedCoating);
      const dat: any = setters.order.prevReviewedCoating;

      setBatches(dat);
    }
  }, [setters.order]);
  const addBatch = () => {
    setBatches([...batches, { batchNumber: '', traceabilityNumbers: [], samples: [] }]);
  };
  const addTN = (index: number) => {
    const newBatches = [...batches];
    newBatches[index].traceabilityNumbers.push('');
    setBatches(newBatches);
  };
  const addSample = (index: number) => {
    const newBatches = [...batches];
    newBatches[index].samples.push({
      porosity: false,
      thickness: 0,
      photos: [],
      validationStatus: false,
    });
    setBatches(newBatches);
  };
  const handlePorosityChange = (batchIndex: number, sampleIndex: number) => {
    const newBatches = [...batches];
    newBatches[batchIndex].samples[sampleIndex].porosity =
      !newBatches[batchIndex].samples[sampleIndex].porosity;
    setBatches(newBatches);
  };

  const handleThicknessChange = (batchIndex: number, sampleIndex: number, thickness: number) => {
    const newBatches = [...batches];
    newBatches[batchIndex].samples[sampleIndex].thickness = thickness;
    setBatches(newBatches);
  };

  const handleFileChange = (batchIndex: number, sampleIndex: number, files: FileList | null) => {
    if (files) {
      const newBatches = [...batches];
      newBatches[batchIndex].samples[sampleIndex].photos = Array.from(files);
      setBatches(newBatches);
    }
  };
  const submitData = async () => {
    // Collect all photos to be uploaded
    const allPhotos = batches.flatMap((batch) =>
      batch.samples.flatMap((sample) => Array.from(sample.photos))
    );
    try {
      // Upload images if there are any
      let imageUrls: string[] = [];
      if (allPhotos.length > 0) {
        const uploadResponse = await uploadImages(allPhotos);
        imageUrls = uploadResponse.urls; // Assuming the response has an urls property
      }
      // Transform the batches to include image URLs
      let urlIndex = 0;
      const transformedBatches = batches.map((batch) => ({
        batchNumber: batch.batchNumber,
        traceabilityNumbers: batch.traceabilityNumbers,
        samples: batch.samples.map((sample) => ({
          porosity: sample.porosity,
          thickness: sample.thickness,
          photos: sample.photos.map(() => imageUrls[urlIndex++] || ''),
        })),
      }));

      // Prepare the data to be sent
      const dataToSubmit = {
        reviewedCoating: transformedBatches,
      };

      await reviewRequest(setters.orderId, dataToSubmit, 'COATING');

      // If the request is successful, handle success (e.g., setting state, notifying user)
      setters.setCheckingCoating(false);
      window.location.reload();
    } catch (error) {
      // Handle any errors here
      console.error('There was an error submitting the data:', error);
    }
  };

  return (
    <Box sx={{ width: '80%', margin: '0 auto' }}>
      <Typography
        variant="h3"
        gutterBottom
        sx={{ mb: 8 }}
      >
        Coating Process Checklist {setters.order?.status == 'Repair' && '- To Repair'}{' '}
        {setters.order?.status == 'Replace' && '- To Replace'}
      </Typography>
      <Box
        display="flex"
        alignItems="center"
      >
        <Typography
          variant="h5" // Adjust the variant to control the size of the text
          component="span" // Change the component to span for inline display
          sx={{ marginRight: 2 }} // Add some right margin for spacing
        >
          Batches
        </Typography>
        {!(
          setters.order != null &&
          setters.order.status != undefined &&
          (setters.order.status == 'Repair' || setters.order.status == 'Replace')
        ) && (
          <Button
            variant="contained"
            onClick={addBatch}
            sx={{
              p: 0,
              lineHeight: 1,
              borderRadius: '10px', // Make it round
              width: '35px', // Adjust width as needed
              height: '35px', // Adjust height as needed
              minWidth: '35px',
              minHeight: '35px',
              fontSize: '25px', // Adjust font size as needed
              m: 0,
              display: 'flex', // Use flexbox for centering content inside the button
              alignItems: 'center', // Center align items vertically inside the button
              justifyContent: 'center', // Center align items horizontally inside the button
            }}
          >
            +
          </Button>
        )}
      </Box>
      <Divider sx={{ mt: 1, mb: 5 }}></Divider>

      {batches.map((batch, batchIndex) => (
        <Box
          key={batchIndex}
          sx={{ mb: 2 }}
        >
          <Typography
            variant="h6" // Adjust the variant to control the size of the text
            component="span" // Change the component to span for inline display
            sx={{ marginRight: 2 }} // Add some right margin for spacing
          >
            Batch # {batchIndex + 1}
          </Typography>
          <TextField
            label="Batch number"
            value={batch.batchNumber}
            onChange={(e) => {
              const newBatches = [...batches];
              newBatches[batchIndex].batchNumber = e.target.value;
              setBatches(newBatches);
            }}
            fullWidth
            margin="normal"
            disabled={
              setters.order != null &&
              setters.order.status != undefined &&
              (setters.order.status == 'Repair' || setters.order.status == 'Replace')
            }
          />
          <Box
            display="flex"
            alignItems="center"
            sx={{ mt: 3 }}
          >
            <Typography
              variant="h6" // Adjust the variant to control the size of the text
              component="span" // Change the component to span for inline display
              sx={{ marginRight: 2 }} // Add some right margin for spacing
            >
              Traceability Numbers
            </Typography>
            {!(
              setters.order != null &&
              setters.order.status != undefined &&
              (setters.order.status == 'Repair' || setters.order.status == 'Replace')
            ) && (
              <Button
                variant="contained"
                onClick={(e) => addTN(batchIndex)}
                sx={{
                  p: 0,
                  lineHeight: 1,
                  borderRadius: '10px', // Make it round
                  width: '35px', // Adjust width as needed
                  height: '35px', // Adjust height as needed
                  minWidth: '35px',
                  minHeight: '35px',
                  fontSize: '25px', // Adjust font size as needed
                  m: 0,
                  display: 'flex', // Use flexbox for centering content inside the button
                  alignItems: 'center', // Center align items vertically inside the button
                  justifyContent: 'center', // Center align items horizontally inside the button
                }}
              >
                +
              </Button>
            )}
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)', // Create three columns
              gap: 2, // Add gap between items
              width: '100%', // Take full width to accommodate child elements
            }}
          >
            {batch.traceabilityNumbers.map((item: string, itemIndex: number) => (
              <TextField
                label="Traceability number"
                value={item}
                onChange={(e) => {
                  const newBatches = [...batches];
                  newBatches[batchIndex].traceabilityNumbers[itemIndex] = e.target.value;
                  setBatches(newBatches);
                }}
                fullWidth
                margin="normal"
                sx={{ width: '100%' }}
                disabled={
                  setters.order != null &&
                  setters.order.status != undefined &&
                  (setters.order.status == 'Repair' || setters.order.status == 'Replace')
                }
              />
            ))}
          </Box>
          <Divider sx={{ mt: 1, mb: 5 }}></Divider>
          <Box
            display="flex"
            alignItems="center"
            sx={{ mt: 3 }}
          >
            <Typography
              variant="h6" // Adjust the variant to control the size of the text
              component="span" // Change the component to span for inline display
              sx={{ marginRight: 2 }} // Add some right margin for spacing
            >
              Samples
            </Typography>
            {!(
              setters.order != null &&
              setters.order.status != undefined &&
              (setters.order.status == 'Repair' || setters.order.status == 'Replace')
            ) && (
              <Button
                variant="contained"
                onClick={(e) => addSample(batchIndex)}
                sx={{
                  p: 0,
                  lineHeight: 1,
                  borderRadius: '10px', // Make it round
                  width: '35px', // Adjust width as needed
                  height: '35px', // Adjust height as needed
                  minWidth: '35px',
                  minHeight: '35px',
                  fontSize: '25px', // Adjust font size as needed
                  m: 0,
                  display: 'flex', // Use flexbox for centering content inside the button
                  alignItems: 'center', // Center align items vertically inside the button
                  justifyContent: 'center', // Center align items horizontally inside the button
                }}
              >
                +
              </Button>
            )}
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)', // Create three columns
              gap: 2, // Add gap between items
              width: '100%', // Take full width to accommodate child elements
            }}
          >
            {batch.samples.map((sample, sampleIndex) => (
              <Box
                key={sampleIndex}
                sx={{
                  display: 'flex',
                  flexDirection: 'column', // Stack children vertically
                  alignItems: 'flex-start', // Align items to the start of the flex container
                  gap: 2, // Space between items
                  mb: 5, // Margin bottom for spacing after the box
                  width: '100%',
                }}
              >
                <Typography
                  variant="h6" // Adjust the variant to control the size of the text
                  component="span" // Change the component to span for inline display
                  sx={{ marginRight: 2 }} // Add some right margin for spacing
                >
                  Sample # {sampleIndex + 1}
                </Typography>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sample.porosity}
                      onChange={() => handlePorosityChange(batchIndex, sampleIndex)}
                      disabled={sample.validationStatus}
                    />
                  }
                  label="Porosity"
                />
                <TextField
                  label="Thickness"
                  type="number"
                  value={sample.thickness}
                  onChange={(e) =>
                    handleThicknessChange(batchIndex, sampleIndex, Number(e.target.value))
                  }
                  margin="normal"
                  disabled={sample.validationStatus}
                />
                <Button
                  variant="contained"
                  component="label"
                >
                  Upload Image
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={(e) => handleFileChange(batchIndex, sampleIndex, e.target.files)}
                    disabled={sample.validationStatus}
                  />
                </Button>
                {sample.photos.map((file, fileIndex) => (
                  <Typography key={fileIndex}>{file.name}</Typography>
                ))}
                {sample.photos.map(
                  (photo, photoIndex) =>
                    typeof photo === 'string' && (
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
                          src={`http://localhost:3005${photo}`}
                          sx={{ maxWidth: '100%', height: 'auto' }} // Using maxWidth to ensure the image does not overflow its container
                        />
                      </Grid>
                    )
                )}
              </Box>
            ))}
          </Box>

          <Divider sx={{ mt: 1, mb: 5 }}></Divider>
        </Box>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={submitData}
        sx={{ mb: 5 }}
      >
        Submit Data for Review
      </Button>
    </Box>
  );
};

export default CoatingChecklist;
