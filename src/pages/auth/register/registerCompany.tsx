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
import { createUser } from 'src/services/userAPI';
import { TextField } from '@mui/material';
import * as bip39 from 'bip39';
import { Buffer } from 'buffer';
import { NewUserData } from 'src/interfaces/NewUserData.interface';
import Cookies from 'js-cookie';
import { useUser } from 'src/contexts/user/userContext';
global.Buffer = Buffer;

interface Values {
  name: string;
  companyName: string;
  position: string;
  email: string;
  contactNumber: string;
  password: string;
}

const initialValues: Values = {
  name: '',
  companyName: '',
  position: '',
  email: '',
  contactNumber: '',
  password: '',
};

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  companyName: Yup.string().required('Company name is required'),
  position: Yup.string().required('Position is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  contactNumber: Yup.string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(10, 'Must be at least 10 digits')
    .required('Contact number is required'),
  password: Yup.string()
    .min(8, 'Password should be at least 8 characters')
    .required('Password is required'),
});

const Page = () => {
  const { goToPage } = useAppNavigation();
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values: Values): Promise<void> => {
      // Send values to the API
      let valuesWithRole: NewUserData = values;
      valuesWithRole.role = 'COMPANY_PIC';
      const creation = await createUser(values);
      if (!creation.error) {
        if (creation.token) {
          Cookies.set('token', creation.token, { expires: 7 });
          goToPage('/');
        }
      } else {
        if (creation.error == 'email is already taken.') {
          formik.setFieldError('email', creation.message);
        } else {
          formik.setStatus(creation.message);
        }
      }
    },
  });

  return (
    <>
      <Seo title="Register as a Company" />
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
          <Typography variant="h5">Join as a Company!</Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Fill in the fields below to become a Company
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

            <FormControl error={!!(formik.touched.name && formik.errors.name)}>
              <FormLabel>Name</FormLabel>
              <TextField
                fullWidth
                name="name"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              {!!(formik.touched.name && formik.errors.name) && (
                <FormHelperText>{formik.errors.name}</FormHelperText>
              )}
            </FormControl>

            <FormControl error={!!(formik.touched.companyName && formik.errors.companyName)}>
              <FormLabel>Company Name</FormLabel>
              <TextField
                fullWidth
                name="companyName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.companyName}
              />
              {!!(formik.touched.companyName && formik.errors.companyName) && (
                <FormHelperText>{formik.errors.companyName}</FormHelperText>
              )}
            </FormControl>

            <FormControl error={!!(formik.touched.position && formik.errors.position)}>
              <FormLabel>Position</FormLabel>
              <TextField
                fullWidth
                name="position"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.position}
              />
              {!!(formik.touched.position && formik.errors.position) && (
                <FormHelperText>{formik.errors.position}</FormHelperText>
              )}
            </FormControl>

            <FormControl error={!!(formik.touched.email && formik.errors.email)}>
              <FormLabel>Email Address</FormLabel>
              <TextField
                fullWidth
                name="email"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {!!(formik.touched.email && formik.errors.email) && (
                <FormHelperText>{formik.errors.email}</FormHelperText>
              )}
            </FormControl>

            <FormControl error={!!(formik.touched.contactNumber && formik.errors.contactNumber)}>
              <FormLabel>Contact Number</FormLabel>
              <TextField
                fullWidth
                name="contactNumber"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.contactNumber}
              />
              {!!(formik.touched.contactNumber && formik.errors.contactNumber) && (
                <FormHelperText>{formik.errors.contactNumber}</FormHelperText>
              )}
            </FormControl>

            <FormControl error={!!(formik.touched.password && formik.errors.password)}>
              <FormLabel>Password</FormLabel>
              <TextField
                fullWidth
                type="password"
                name="password"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {!!(formik.touched.password && formik.errors.password) && (
                <FormHelperText>{formik.errors.password}</FormHelperText>
              )}
            </FormControl>

            <Button
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              type="submit"
              variant="contained"
            >
              Register
            </Button>
          </Stack>
        </form>
      </div>
    </>
  );
};

export default Page;
