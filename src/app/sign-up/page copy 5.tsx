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

import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
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


// function Copyright(props: any) {
//   return (
//     <Typography variant="body2" color="text.secondary" align="center" {...props}>
//       {'Copyright © '}
//       <Link color="inherit" href="https://mui.com/">
//         Your Website
//       </Link>{' '}
//       {new Date().getFullYear()}
//       {'.'}
//     </Typography>
//   );
// }

// TODO remove, this demo shouldn't need to reset the theme.
// กำหนดธีมสีเข้ม
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

// สร้าง styled component สำหรับ Label แสดงชื่อ Component และประเภทข้อมูล
const Label = styled(({ className, componentName, valueType }: { className?: string, componentName: string, valueType: string }) => (
  <span className={className}>
    <strong>{componentName}</strong> ({valueType})
  </span>
))(({ theme }) => ({
  color: theme.palette.primary.main,
}));

// ฟังก์ชัน renderInput จะรับ params ของ type TextFieldProps จาก @mui/x-date-pickers
const renderTextField = (params: TextFieldProps) => (
  <TextField
    {...params}
    fullWidth  // กำหนดให้เต็มความกว้าง
    sx={{ width: '100%' }} // กำหนดความกว้างให้เท่ากันกับ TextField อื่น
  />
);

// กำหนด function สำหรับ renderInput อย่างถูกต้อง
const renderInput = (params: TextFieldProps) => (
  <TextField
    {...params}
    InputLabelProps={{ style: { color: 'white' } }}
    InputProps={{ style: { color: 'white', borderColor: 'white' } }}
    sx={{
      '& .MuiOutlinedInput-root': {
        '&:hover fieldset': { borderColor: 'white' },
        '&.Mui-focused fieldset': { borderColor: 'white' },
      },
    }}
  />
);

interface UserData {
  first_name: string;
  last_name: string;
  username: string;
  password: string;
  email: string;
  birthday?: string;
  phone_number?: string;
  gender?: string;
  role: string;
}

export default function SignUp() {
  const theme = useTheme();

  // const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  // const handleClick = () => {
  //   router.push('/dashboard');
  // };
  const router = useRouter(); // Initialize the router
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error'>('success');

  const [message, setMessage] = useState('');

  const [alert, setAlert] = React.useState<{ open: boolean; message: string; severity: string }>({ open: false, message: '', severity: '' });

  const [birthday, setBirthday] = React.useState<string | null>(null);

  // Capture the date selected in the DatePicker
  const handleBirthdayChange = (date: dayjs.Dayjs | null) => {
    // Change the format to MM-DD-YYYY
    setBirthday(date ? date.format('MM-DD-YYYY') : null);
  };

  const checkUserExists = async (username: string, email: string) => {
    try {
      const usersResponse = await axios.get('http://localhost:8080/api/users');
      const users = usersResponse.data;
      return users.some((user: { username: any; email: any; }) => user.username === username || user.email === email);
    } catch (error) {
      console.error('Error fetching users:', error);
      return false;
    }
  };

  // อัพเดตส่วนของ handleSubmit เพื่อจัดการการแจ้งเตือน
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const userData = {
      first_name: data.get('firstName') as string,
      last_name: data.get('lastName') as string,
      username: data.get('username') as string,
      password: data.get('password') as string,
      email: data.get('email') as string,
      birthday: birthday || undefined,
      phone_number: data.get('phoneNumber') as string || undefined,
      gender: data.get('gender') as string || undefined,
      role: 'user',
    };

    console.log('User data being sent:', userData);

    try {
      // Client-side validations
      if (!/^[a-zA-Z0-9]+$/.test(userData.username)) {
        throw new Error('Username ต้องเป็นภาษาอังกฤษเท่านั้นและไม่มีช่องว่าง');
      }
      if (!userData.email.includes('@')) {
        throw new Error('Email ต้องมี "@"');
      }
      if (!/^\+?\d+$/.test(userData.phone_number ?? '')) {
        throw new Error('เบอร์โทรศัพท์ต้องเป็นหมายเลขเบอร์โทรศัพท์จริงๆเท่านั้น ห้ามเอาเบอร์ปลอมหรือเบอร์ที่ไม่มีอยู่จริงมาหลอก');
      }
      if (dayjs().diff(dayjs(userData.birthday, 'MM-DD-YYYY'), 'year') < 10) {
        throw new Error('วันเกิดต้องไม่ต่ำกว่า 10 ปีจากวันปัจจุบัน');
      }

      // Check for existing username or email
      const exists = await checkUserExists(userData.username, userData.email);
      if (exists) {
        throw new Error('Username หรือ Email นี้มีคนใช้แล้ว');
      }

      // Create user in Firebase Auth
      const firebaseUser = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      console.log('Firebase user created:', firebaseUser);

      // Additional user data logic here, like saving the user profile in your own database
      setAlertMessage('สมัครสมาชิกสำเร็จ!');
      setAlertSeverity('success');
      router.push('/sign-in');
    } catch (error: any) {
      if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
        setAlertMessage('อีเมลนี้ได้ถูกใช้งานแล้วในระบบ');
      } else {
        console.error('Error:', error);
        setAlertMessage('สมัครสมาชิกไม่สำเร็จ: ' + (error.message || 'เกิดข้อผิดพลาด'));
      }
      setAlertSeverity('error');
    }
    setOpenSnackbar(true);
  };




  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const [cleared, setCleared] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => { };
  }, [cleared]);

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

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
            position: 'relative',  // Ensure this is positioned relative to its container
            zIndex: 2,  // Lower z-index than Header
          }}
        >
          <br />
          <br />
          {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar> */}
          <Typography component="h1" variant="h5">
            สมัครสมาชิก
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                  helperText="ได้ทั้งภาษาไทยภาษาอังกฤษ"
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
                  helperText="ได้ทั้งภาษาไทยภาษาอังกฤษ"
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
                  helperText="ภาษาอังกฤษเท่านั้น"
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
                  helperText="หมายเลขโทรศัพท์เท่านั้น"
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
                      <DatePicker
                        // label="Birthday"
                        value={birthday ? dayjs(birthday, 'MM-DD-YYYY') : null}
                        onChange={handleBirthdayChange}
                      />
                    </DemoItem>
                    {cleared && (
                      <Alert
                        sx={{ position: 'absolute', bottom: 0, right: 0 }}
                        severity="success"
                      >
                        Field cleared!
                      </Alert>
                    )}
                  </DemoContainer>
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">เพศ</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    // name="row-radio-buttons-group"
                    name="gender"
                  >
                    <FormControlLabel value="male" control={<Radio />} label="ชาย" />
                    <FormControlLabel value="female" control={<Radio />} label="หญิง" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                color: 'white',  // ตั้งค่าตัวอักษรเป็นสีขาว
                backgroundColor: 'red',  // ตั้งค่าพื้นหลังเป็นสีแดง
                '&:hover': {
                  backgroundColor: 'darkred',  // ตั้งค่าพื้นหลังของปุ่มเมื่อ hover เป็นสีแดงเข้ม
                }
              }}
            >
              สมัครสมาชิก
            </Button>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
              <Alert onClose={handleSnackbarClose} severity={alertSeverity} sx={{ width: '100%' }}>
                {alertMessage}
              </Alert>
            </Snackbar>
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                OR
              </Typography>
            </Divider>

            <Stack direction="row" spacing={2}>
              <Button
                fullWidth
                size="large"
                color="inherit"
                variant="outlined"
                sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
              >
                <Iconify icon="eva:google-fill" color="#DF3E30" />
              </Button>

              <Button
                fullWidth
                size="large"
                color="inherit"
                variant="outlined"
                sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
              >
                <Iconify icon="eva:facebook-fill" color="#1877F2" />
              </Button>

              {/* <Button
              fullWidth
              size="large"
              color="inherit"
              variant="outlined"
              sx={{ borderColor: alpha(theme.palette.grey[500], 0.16) }}
            >
              <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
            </Button> */}
            </Stack>

            <br />
            <br />

            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/sign-in" variant="body2">
                  มีบัญชีอยู่แล้วใช่ไหม? เข้าสู่ระบบ
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* <Copyright sx={{ mt: 5 }} /> */}
      </Container>
    </ThemeProvider>
  );
}