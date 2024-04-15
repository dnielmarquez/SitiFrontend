import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Button, TextField, Typography, Link } from '@mui/material';
import { requestOTP, verifyOTP } from 'src/services/userAPI';
import Cookies from 'js-cookie';
import { useUser } from 'src/contexts/user/userContext';
import { useAppNavigation } from 'src/hooks/use-navigation';

const OTPValidationPage = () => {
  const { goToPage } = useAppNavigation();

  // Function to handle OTP resend
  const handleResendOTP = async () => {
    const token = Cookies.get('token');
    if (token) {
      await requestOTP({ token: token });
    }
  };

  return (
    <>
      <Typography
        variant="h5"
        sx={{ mb: 2 }}
      >
        User Validation
      </Typography>
      <Typography sx={{ mb: 4 }}>Please wait for the administrator to approve your user.</Typography>
    </>
  );
};

export default OTPValidationPage;
