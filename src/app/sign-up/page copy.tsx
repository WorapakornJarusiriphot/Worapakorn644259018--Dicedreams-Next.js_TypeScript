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

import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaGoogle, FaFacebook, FaGithub } from "react-icons/fa";
import useAxiosPublic from "@/hook/useAxiosPublic";
import Modal from "@/components/Modal";
import useAuth from "@/hook/useAuth";
import Swal from "sweetalert2";

import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import { UseFormReturn } from 'react-hook-form';

import { from } from 'rxjs';

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
  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   console.log({
  //     email: data.get('email'),
  //     password: data.get('password'),
  //   });
  // };

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const data = new FormData(event.currentTarget);
  //   console.log({
  //     email: data.get('email'),
  //     password: data.get('password'),
  //   });
  // };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const formSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({
      email: email,
      password: password,
    });
  };

  // const { createUser, updateUserProfile, sigUpWithGoogle } = useAuth();

  const { createUser, updateUserProfile, sigUpWithGoogle } = useAuth() ?? {};


  const axiosPublic = useAxiosPublic();

  const location = useLocation();
  const navigate = useNavigate();


  const { register, handleSubmit, watch, formState: { errors: formErrors } } = useForm<FormData>();

  interface FormData {
    name: string;
    email: string;
    password: string;
    photoURL: string;
  }

  interface SignUpFormData {
    firstName: string;
    lastName: string;
    username: string;
    phoneNumber: string;
    email: string;
    password: string;
    // เพิ่มประเภทข้อมูลที่ต้องการจัดการเพิ่มเติมตามความต้องการ
  }


  const { register: signUpRegister, handleSubmit: signUpHandleSubmit, formState: { errors } } = useForm<SignUpFormData>();

  const onSubmit = (data: SignUpFormData) => {
    // ที่นี่คุณสามารถเรียกใช้ logic สำหรับการสร้างผู้ใช้ใหม่
    console.log(data);
  };
  const googleSignUp = () => {
    sigUpWithGoogle()
      .then((result: any) => {
        const user = result.user;
        const userInfo: FormData = {
          name: result.user?.displayName,
          email: result.user?.email,
          photoURL: result.user?.photoURL,
          password: ''
        };


        axiosPublic.post("/users", userInfo).then((response: any) => {
          //console.log(response);
          //console.log(user);
          Swal.fire({
            title: "Google Sign Up Successfully",
            icon: "success",
            timer: 1500,
          });
          navigate(from, { replace: true });
        });
      })
      .catch((error: any) => {
        console.log(error);
      });
  };
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

function googleSignUp(event: MouseEvent<HTMLButtonElement, MouseEvent>): void {
  throw new Error('Function not implemented.');
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
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('firstName')}
                required
                fullWidth
                id="firstName"
                label="ชื่อจริง"
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register('lastName')}
                required
                fullWidth
                id="lastName"
                label="นามสกุล"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('username')}
                required
                fullWidth
                id="username"
                label="ชื่อผู้ใช้"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('phoneNumber')}
                required
                fullWidth
                id="phoneNumber"
                label="หมายเลขโทรศัพท์"
                type="tel"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('email')}
                required
                fullWidth
                id="email"
                label="อีเมล"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register('password')}
                required
                fullWidth
                id="password"
                label="รหัสผ่าน"
                type="password"
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
            <Grid item xs={12}>
              <button
                className="btn btn-ghost btn-circle hover:bg-red hover:text-white"
                onClick={googleSignUp}
              >
                <FaGoogle />
              </button>
              <button className="btn btn-ghost btn-circle  hover:bg-red hover:text-white">
                <FaFacebook />
              </button>
              <button className="btn btn-ghost btn-circle  hover:bg-red hover:text-white">
                <FaGithub />
              </button>
              </Grid>
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