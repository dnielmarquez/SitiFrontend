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
import { useNavigate } from 'react-router';
import { useAppNavigation } from 'src/hooks/use-navigation';

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
  email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
  password: Yup.string().max(255).required('Password is required'),
});

const Page = () => {
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (): void => {},
  });
  const { goToPage } = useAppNavigation();

  return (
    <>
      <Seo title="Login" />
      <div>
        <Stack
          sx={{ mb: 4 }}
          spacing={1}
        >
          <Typography variant="h4">Create your account</Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Select between being a Supplier or a CompanyPIC.
            <Link
              href="#"
              underline="hover"
              variant="subtitle2"
            >
              Join us
            </Link>
          </Typography>
        </Stack>
        <form
          noValidate
          onSubmit={formik.handleSubmit}
        >
          <Stack spacing={3}>
            <Button
              fullWidth
              sx={{ mt: 3 }}
              size="large"
              type="submit"
              variant="contained"
              onClick={() => goToPage('/auth/signin')}
            >
              Login
            </Button>
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={() => goToPage('/auth/register')}
            >
              Register as Supplier
            </Button>
            <Button
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              onClick={() => goToPage('/auth/registerCompany')}
            >
              Register as CompanyPIC
            </Button>
          </Stack>

          <Box sx={{ mt: 3 }}>
            <Link
              href="#"
              underline="hover"
              variant="subtitle2"
            >
              We love automation.
            </Link>
          </Box>
        </form>
      </div>
    </>
  );
};

export default Page;
