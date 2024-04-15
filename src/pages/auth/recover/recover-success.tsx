import * as Yup from 'yup';
import { useFormik } from 'formik';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import Typography from '@mui/material/Typography';
import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { useAppNavigation } from 'src/hooks/use-navigation';
import { createUser, recoverAccount, sendRecoverCode } from 'src/services/userAPI';
import { TextField } from '@mui/material';
import * as bip39 from 'bip39';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

interface Values {
  resetCode: string;
  newPassword: string;
  confirmPassword: string;
}

const initialValues: Values = {
  resetCode: '',
  newPassword: '',
  confirmPassword: '',
};

const validationSchema = Yup.object({
  resetCode: Yup.string().required('Reset code is required'),
  newPassword: Yup.string()
    .min(8, 'Password should be at least 8 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .required('Confirm password is required'),
});

const Page = () => {
  const { goToPage } = useAppNavigation();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values: Values): Promise<void> => {
      try {
        const resetResponse = await sendRecoverCode({
          resetToken: values.resetCode,
          newPassword: values.newPassword,
        });
        if (resetResponse.success) {
          goToPage('/auth/signin');
        }
      } catch (error: any) {
        formik.setStatus(error.response.data.message);
      }
    },
  });

  return (
    <>
      <Seo title="Reset Password" />
      <div>
        <Stack
          sx={{ mb: 4 }}
          spacing={1}
        >
          <Typography variant="h5">Reset Your Password</Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Enter the reset code sent to your email and choose a new password.
          </Typography>
        </Stack>
        <form
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <Stack
            spacing={2}
            direction="column"
          >
            {formik.status && (
              <Typography
                color="error"
                variant="body2"
              >
                {formik.status}
              </Typography>
            )}
            <FormControl error={!!(formik.touched.resetCode && formik.errors.resetCode)}>
              <FormLabel>Reset Code</FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                name="resetCode"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.resetCode}
              />
              {!!(formik.touched.resetCode && formik.errors.resetCode) && (
                <FormHelperText>{formik.errors.resetCode}</FormHelperText>
              )}
            </FormControl>

            <FormControl error={!!(formik.touched.newPassword && formik.errors.newPassword)}>
              <FormLabel>New Password</FormLabel>
              <TextField
                fullWidth
                type="password"
                name="newPassword"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.newPassword}
              />
              {!!(formik.touched.newPassword && formik.errors.newPassword) && (
                <FormHelperText>{formik.errors.newPassword}</FormHelperText>
              )}
            </FormControl>

            <FormControl
              error={!!(formik.touched.confirmPassword && formik.errors.confirmPassword)}
            >
              <FormLabel>Confirm New Password</FormLabel>
              <TextField
                fullWidth
                type="password"
                name="confirmPassword"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
              />
              {!!(formik.touched.confirmPassword && formik.errors.confirmPassword) && (
                <FormHelperText>{formik.errors.confirmPassword}</FormHelperText>
              )}
            </FormControl>

            <Button
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              type="submit"
              variant="contained"
            >
              Reset Password
            </Button>
          </Stack>
        </form>
      </div>
    </>
  );
};

export default Page;
