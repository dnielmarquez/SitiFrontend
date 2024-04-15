import * as Yup from 'yup';
import { useFormik } from 'formik';
import ArrowLeftIcon from '@untitled-ui/icons-react/build/esm/ArrowLeft';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/components/router-link';
import { Seo } from 'src/components/seo';
import { paths } from 'src/paths';
import { useAppNavigation } from 'src/hooks/use-navigation';
import { loginUser } from 'src/services/userAPI';
import Cookies from 'js-cookie';

interface Values {
  email: string;
  password: string;
  submit: null;
}

const initialValues: Values = {
  email: '',
  password: '',
  submit: null,
};

const validationSchema = Yup.object({
  email: Yup.string().max(255).required('email is required'),
  password: Yup.string().max(255).required('Password is required'),
});

const Page = () => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values: Values): Promise<void> => {
      try {
        const signinResult = await loginUser(values);
        if (signinResult.token) {
          Cookies.set('token', signinResult.token, { expires: 7 });
          goToPage('/');
        } else {
          formik.setStatus(signinResult.error);
        }
      } catch (error: any) {
        formik.setStatus(error.response.data.message);
      }
    },
  });
  const { goToPage } = useAppNavigation();

  return (
    <>
      <Seo title="Login" />
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
          <Typography variant="h5">Login</Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Don&apos;t have an account? &nbsp;
            <Link
              component={RouterLink}
              href={'/auth/login'}
              underline="hover"
              variant="subtitle2"
            >
              Create one
            </Link>
          </Typography>
        </Stack>
        <form
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <Stack spacing={3}>
            {formik.status && (
              <Typography
                color="error"
                variant="body2"
              >
                {formik.status}
              </Typography>
            )}
            <TextField
              autoFocus
              error={!!(formik.touched.email && formik.errors.email)}
              fullWidth
              helperText={formik.touched.email && formik.errors.email}
              label="Email"
              name="email"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="text"
              value={formik.values.email}
            />
            <TextField
              error={!!(formik.touched.password && formik.errors.password)}
              fullWidth
              helperText={formik.touched.password && formik.errors.password}
              label="Password"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.password}
            />
          </Stack>
          <Button
            fullWidth
            sx={{ mt: 3 }}
            size="large"
            type="submit"
            variant="contained"
          >
            Login
          </Button>
          <Box sx={{ mt: 3 }}>
            <Link
              component={RouterLink}
              href={'/auth/recover'}
              underline="hover"
              variant="subtitle2"
            >
              Forgot password?
            </Link>
          </Box>
        </form>
      </div>
    </>
  );
};

export default Page;
