'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
// import DatePicker from '@mui/lab/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

import { styled } from "@mui/material/styles";

import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import { TextFieldProps } from '@mui/material/TextField';

import Alert from '@mui/material/Alert';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig"; // ตรวจสอบว่า path ถูกต้อง

// import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';

import { useRouter } from 'next/navigation'; // Import useRouter from next/router

import axios, { AxiosError } from 'axios';

import { useState } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';


import { bgGradient } from '@/theme/css';

import Logo from '@/components/logo';
import Iconify from '@/components/iconify';
import { FirebaseError } from 'firebase/app';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FormHelperText } from '@mui/material';
import { fetchSignInMethodsForEmail } from "firebase/auth";



interface MyDatePickerProps extends DatePickerProps<Dayjs, false> {
  helperText?: string;
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#fff",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label": {
            color: "white",
          },
          "& .MuiInputBase-root": {
            color: "white",
            "& fieldset": {
              borderColor: "white",
            },
          },
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "white",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
          },
        },
      },
    },
  },
});

const validationSchema = Yup.object({
  firstName: Yup.string().required('กรุณากรอกชื่อจริง'),
  lastName: Yup.string().required('กรุณากรอกนามสกุล'),
  username: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, 'Username ต้องเป็นภาษาอังกฤษเท่านั้นและไม่มีช่องว่าง')
    .required('กรุณากรอกชื่อผู้ใช้')
    .test('checkDuplicateUsername', 'Username นี้มีคนใช้แล้ว', async function (value) {
      if (!value) return true;
      try {
        const response = await axios.get('http://localhost:8080/api/users');
        const users = response.data;
        return !users.some((user: { username: string }) => user.username === value);
      } catch (error) {
        return false; // หรือคุณอาจจะจัดการข้อผิดพลาดในรูปแบบอื่น
      }
    }),
  email: Yup.string()
    .email('กรุณากรอกอีเมลที่ถูกต้อง')
    .required('กรุณากรอกอีเมล')
    .test('checkDuplicateEmail', 'Email นี้มีคนใช้แล้ว', async function (value) {
      if (!value) return true;
      try {
        const response = await axios.get('http://localhost:8080/api/users');
        const users = response.data;
        return !users.some((user: { email: string }) => user.email === value);
      } catch (error) {
        return false; // หรือคุณอาจจะจัดการข้อผิดพลาดในรูปแบบอื่น
      }
    }),
  password: Yup.string()
    .min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร')
    .matches(/[A-Z]/, 'รหัสผ่านต้องมีอักษรพิมพ์ใหญ่')
    .matches(/[a-z]/, 'รหัสผ่านต้องมีอักษรพิมพ์เล็ก')
    .matches(/[0-9]/, 'รหัสผ่านต้องมีตัวเลข')
    .matches(/[!"#$%&'()*+,-./:;<=>?@[\\\]^_`{|}~]/, 'รหัสผ่านต้องมีสัญลักษณ์พิเศษ')
    .required('กรุณากรอกรหัสผ่าน'),
  phoneNumber: Yup.string()
    .matches(/^\+?\d+$/, 'เบอร์โทรศัพท์ต้องเป็นหมายเลขเบอร์โทรศัพท์จริงๆเท่านั้น')
    .required('กรุณากรอกหมายเลขโทรศัพท์'),
  birthday: Yup.date()
    .nullable()
    .required('กรุณาเลือกวันเกิด')
    .test('age', 'วันเกิดต้องไม่ต่ำกว่า 10 ปีจากวันปัจจุบัน', function (value) {
      return dayjs().diff(dayjs(value), 'year') >= 10;
    }),
  gender: Yup.string().required('กรุณาเลือกเพศ'),
});

export default function SignUp() {
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      phoneNumber: '',
      birthday: null,
      gender: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        // ตรวจสอบว่าอีเมลนี้ถูกใช้งานแล้วหรือไม่ใน Firebase
        const signInMethods = await fetchSignInMethodsForEmail(auth, values.email);
        if (signInMethods.length > 0) {
          setAlertMessage('อีเมลนี้มีคนใช้แล้ว');
          setAlertSeverity('error');
          setOpenSnackbar(true);
          return;
        }

        // Create user in Firebase Auth
        const firebaseUser = await createUserWithEmailAndPassword(auth, values.email, values.password);
        console.log('Firebase user created:', firebaseUser);

        // Save user data in MySQL
        const response = await axios.post('http://localhost:8080/api/users', values);
        console.log('Response from server:', response.data);

        setAlertMessage('สมัครสมาชิกสำเร็จ!');
        setAlertSeverity('success');
        setOpenSnackbar(true);
        // Delay navigation to show success message
        setTimeout(() => {
          router.push('/sign-in');
        }, 3000); // Change page after 3 seconds
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          setAlertMessage('อีเมลนี้ได้ถูกใช้งานแล้วในระบบ');
        } else {
          setAlertMessage('สมัครสมาชิกไม่สำเร็จ: ' + (error.message || 'เกิดข้อผิดพลาด'));
        }
        console.error('Error:', error);
        setAlertSeverity('error');
        setOpenSnackbar(true);
      }
    },
  });

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  interface MyDatePickerProps extends DatePickerProps<Dayjs, false> {
    helperText?: string;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <br />
          <br />
          <Typography component="h1" variant="h5">
            สมัครสมาชิก
          </Typography>
          <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="ชื่อจริง"
                  autoFocus
                  helperText={formik.touched.firstName && formik.errors.firstName ? formik.errors.firstName : 'ได้ทั้งภาษาไทยภาษาอังกฤษ'}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="นามสกุล"
                  name="lastName"
                  autoComplete="family-name"
                  helperText={formik.touched.lastName && formik.errors.lastName ? formik.errors.lastName : 'ได้ทั้งภาษาไทยภาษาอังกฤษ'}
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="ชื่อผู้ใช้"
                  name="username"
                  autoComplete="username"
                  helperText={formik.touched.username && formik.errors.username ? formik.errors.username : 'ภาษาอังกฤษเท่านั้น'}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="phoneNumber"
                  label="หมายเลขโทรศัพท์"
                  type="tel"
                  id="phoneNumber"
                  autoComplete="tel"
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber ? formik.errors.phoneNumber : 'หมายเลขโทรศัพท์จริงๆเท่านั้น'}
                  error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="อีเมล"
                  name="email"
                  autoComplete="email"
                  helperText={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="รหัสผ่าน"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  helperText={formik.touched.password && formik.errors.password ? formik.errors.password : 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร, มีอักษรพิมพ์ใหญ่, มีอักษรพิมพ์เล็ก, มีตัวเลข, มีสัญลักษณ์พิเศษ'}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={['DateTimePicker']}
                  >
                    <DemoItem
                      label={'วันเกิด *'}
                    >
                      <FormControl error={formik.touched.birthday && Boolean(formik.errors.birthday)}>
                        <DatePicker
                          label="วันเกิด"
                          value={formik.values.birthday}
                          onChange={(value) => formik.setFieldValue('birthday', value)}
                        // error={formik.touched.birthday && Boolean(formik.errors.birthday)}
                        // helperText={formik.touched.birthday && formik.errors.birthday ? formik.errors.birthday : ''}
                        // onBlur={formik.handleBlur}
                        />
                        <FormHelperText>
                          {formik.touched.birthday && formik.errors.birthday ? formik.errors.birthday : 'วันเกิดต้องไม่ต่ำกว่า 10 ปีจากวันปัจจุบัน'}
                        </FormHelperText>
                      </FormControl>
                    </DemoItem>
                    {/* {cleared && (
                          <Alert
                            sx={{ position: 'absolute', bottom: 0, right: 0 }}
                            severity="success"
                          >
                            Field cleared!
                          </Alert>
                        )} */}
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset" error={formik.touched.gender && Boolean(formik.errors.gender)}>
                  <FormLabel component="legend">เพศ *</FormLabel>
                  <RadioGroup
                    row
                    aria-label="gender"
                    name="gender"
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <FormControlLabel value="ชาย" control={<Radio />} label="ชาย" />
                    <FormControlLabel value="หญิง" control={<Radio />} label="หญิง" />
                  </RadioGroup>
                  {formik.touched.gender && formik.errors.gender && (
                    <Typography variant="body2" color="error">
                      {formik.errors.gender}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                color: 'white',
                backgroundColor: 'red',
                '&:hover': {
                  backgroundColor: 'darkred',
                },
              }}
            >
              สมัครสมาชิก
            </Button>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
              <Alert onClose={handleSnackbarClose} severity={alertSeverity} sx={{ width: '100%' }}>
                {alertMessage}
              </Alert>
            </Snackbar>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/sign-in" variant="body2">
                  มีบัญชีอยู่แล้วใช่ไหม? เข้าสู่ระบบ
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}