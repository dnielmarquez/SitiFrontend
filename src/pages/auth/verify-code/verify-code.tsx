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
global.Buffer = Buffer;

interface Values {
  userName: string;
  password: string;
  mnemonic: string;
}

const initialValues: Values = {
  userName: '',
  password: '',
  mnemonic: '',
};

const validationSchema = Yup.object({
  userName: Yup.string().required('userName is required'),
  password: Yup.string()
    .min(8, 'Password should be at least 8 characters')
    .required('Password is required'),
  mnemonic: Yup.string()
    .test('is-valid-mnemonic', 'Invalid mnemonic', (value) => {
      if (value) {
        return bip39.validateMnemonic(value);
      }
      return false;
    })
    .required('Mnemonic is required'),
});

const Page = () => {
  const { goToPage } = useAppNavigation();

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values: Values): Promise<void> => {
      // Send values to the API
      const creation = await createUser(values);
      if (!creation.error) {
        if (creation.id) {
          goToPage('/');
        }
      } else {
        if (creation.error == 'Username is already taken.') {
          formik.setFieldError('userName', creation.error);
        } else if(creation.error == 'Mnemonic is invalid.') {
          formik.setFieldError('mnemonic', creation.error);
        }else{
          formik.setStatus(creation.error);
        }
      }
    },
  });

  return (
    <>
      <Seo title="Verify Code" />
      <div>
        <Stack
          sx={{ mb: 4 }}
          spacing={1}
        >
          <Typography variant="h5">You have saved it, right?</Typography>
          <Typography
            color="text.secondary"
            variant="body2"
          >
            Check that you have saved your secret recovery phrase. And choose a userName and a
            strong Password &nbsp;
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

            <FormControl error={!!(formik.touched.userName && formik.errors.userName)}>
              <FormLabel>userName</FormLabel>
              <TextField
                fullWidth
                name="userName"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.userName}
              />
              {!!(formik.touched.userName && formik.errors.userName) && (
                <FormHelperText>{formik.errors.userName}</FormHelperText>
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

            <FormControl error={!!(formik.touched.mnemonic && formik.errors.mnemonic)}>
              <FormLabel>Words combination (Mnemonic Phrase)</FormLabel>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                name="mnemonic"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                onFocus={() => formik.setFieldTouched('mnemonic')}
                value={formik.values.mnemonic}
              />
              {!!(formik.touched.mnemonic && formik.errors.mnemonic) && (
                <FormHelperText>{formik.errors.mnemonic}</FormHelperText>
              )}
            </FormControl>

            <Button
              fullWidth
              size="large"
              sx={{ mt: 3 }}
              type="submit"
              variant="contained"
            >
              Create card
            </Button>
          </Stack>
        </form>
      </div>
    </>
  );
};

export default Page;
