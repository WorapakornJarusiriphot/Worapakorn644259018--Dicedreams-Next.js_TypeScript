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

import { useState } from 'react';
import axios from 'axios';

import bcrypt from 'bcrypt';
import User from '../api/models/user';

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

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    username: '',
    birthday: '',
    phoneNumber: '',
    gender: '',
    // เพิ่มฟิลด์อื่น ๆ ที่คุณต้องการเก็บ
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [birthday, setBirthday] = React.useState<dayjs.Dayjs | null>(null);

  const router = useRouter(); // Initialize the router
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error'>('success');

const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);

  // กำหนดข้อมูลให้ตรงกับ API
  const userData = {
    first_name: data.get('firstName'),
    last_name: data.get('lastName'),
    username: data.get('username'),
    email: data.get('email'),
    password: data.get('password'),
    phone_number: data.get('phoneNumber'),
    gender: data.get('row-radio-buttons-group'),
    birthday: data.get('birthday')  // ตรวจสอบให้แน่ใจว่าฟิลด์ 'birthday' ส่งข้อมูลวันที่ถูกต้อง
  };

  try {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    await User.create(userData);

    if (response.ok) {
      setAlertMessage('สมัครสมาชิกสำเร็จแล้ว');
      setAlertSeverity('success');
      router.push('/sign-in'); // Navigate to the sign-in page after successful registration
    } else {
      const errorResponse = await response.json();
      setAlertMessage(`สมัครสมาชิกไม่สำเร็จ: ${errorResponse.message}`);
      setAlertSeverity('error');
    }
  } catch (error) {
    setAlertMessage('เกิดข้อผิดพลาดในการสมัครสมาชิก');
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
                      <DatePicker />
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
                    name="row-radio-buttons-group"
                  >
                    <FormControlLabel value="female" control={<Radio />} label="ชาย" />
                    <FormControlLabel value="male" control={<Radio />} label="หญิง" />
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