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
import { createUser, recoverAccount } from 'src/services/userAPI';
import { TextField } from '@mui/material';
import * as bip39 from 'bip39';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

interface Values {
  email: string;
}

const initialValues: Values = {
  email: '',
};

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
});

const Page = () => {
  const { goToPage } = useAppNavigation();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values: Values): Promise<void> => {
      try {
        const recovery = await recoverAccount({ email: values.email });
        if (recovery.success) {
          goToPage('/auth/recover-success');
        }
      } catch (error: any) {
        formik.setStatus(error.response.data.message);
      }
    },
  });

  return (
    <>
      <Seo title="Recovery" />
      <div>
        <Box sx={{ mb: 4 }}>
          <Link
            color="text.primary"
            component={RouterLink}
            href={'/auth/login'}
            sx={{
              alignItems: 'center',
              display: 'inline-flex',
            }}
            underline="hover"
          >
            <SvgIcon sx={{ mr: 1 }}>
              <ArrowLeftIcon />
            </SvgIcon>
            <Typography variant="subtitle2">Go back</Typography>
          </Link>
        </Box>
        <Stack
          sx={{ mb: 4 }}
          spacing={1}
        >
          <Typography variant="h5">Recover Your Password</Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Enter your email to recover your password.
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
            <FormControl error={!!(formik.touched.email && formik.errors.email)}>
              <FormLabel>Email</FormLabel>
              <TextField
                fullWidth
                variant="outlined"
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {!!(formik.touched.email && formik.errors.email) && (
                <FormHelperText>{formik.errors.email}</FormHelperText>
              )}
            </FormControl>

            <Button
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              type="submit"
              variant="contained"
            >
              Send Recovery Email
            </Button>
          </Stack>
        </form>
      </div>
    </>
  );
};

export default Page;
