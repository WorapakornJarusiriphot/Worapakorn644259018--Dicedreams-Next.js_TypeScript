'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';



import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField, { FilledTextFieldProps, OutlinedTextFieldProps, StandardTextFieldProps, TextFieldVariants } from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
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
import FormLabel from '@mui/material/FormLabel';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig"; // ตรวจสอบว่า path ถูกต้อง

// import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';

//import { useRouter } from 'next/navigation'; // Import useRouter from next/router

import axios, { AxiosError } from 'axios';

import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import { alpha, useTheme } from '@mui/material/styles';
import InputAdornment from '@mui/material/InputAdornment';


import { bgGradient } from '@/theme/css';

import Logo from '@/components/logo';
import Iconify from '@/components/iconify';





import { usePopover } from "@/hook/use-popover";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import { Bell as BellIcon } from "@phosphor-icons/react/dist/ssr/Bell";
import { List as ListIcon } from "@phosphor-icons/react/dist/ssr/List";
import { MagnifyingGlass as MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Users as UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
// import { MobileNav } from "@/layout/MobileNav";
import { UserPopover } from "@/layout/user-popover";

// // import jwtDecode from 'jwt-decode';
// import { jwtDecode } from "jwt-decode";
// // import { JwtPayload } from 'jsonwebtoken';
// import { JwtPayload } from 'jwt-decode';

import { jwtDecode, JwtPayload as OriginalJwtPayload } from "jwt-decode";

import { Dayjs } from 'dayjs';

import { NextRouter } from 'next/router'; // Import the necessary type for the router object

import { useRouter } from 'next/router';

// กำหนด interface สำหรับข้อมูลผู้ใช้
interface UserData {
  users_id: string;
  role: string;
  firstName: string;
  lastName: string;
  birthday: Dayjs | null;
  username: string;
  email: string;
  phoneNumber: string;
  gender: string;
  userImage: string;
  createdAt: string;
  updatedAt: string;
}

// // กำหนด type ของ params ให้ชัดเจน
// const renderInput = (params: TextFieldProps) => (
//   <TextField {...params} />
// );

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

export default function AccountDetailsForm(): JSX.Element {
  const router = useRouter();

  //const router: NextRouter = useRouter(); // Update the type of router to include the query property

  //const { users_id } = router.query; // ดึง users_id จาก URL

  const [user, setUser] = useState<UserData>({
    users_id: '',
    role: '',
    firstName: '',
    lastName: '',
    birthday: null,
    username: '',
    email: '',
    phoneNumber: '',
    gender: '',
    userImage: '',
    createdAt: '',
    updatedAt: ''
  });

  // ตรวจสอบว่า router พร้อมใช้งานก่อนดึงข้อมูล
  useEffect(() => {
    if (!router.isReady) return;

    const users_id = router.query.users_id as string;

    if (users_id) {
      fetchUserData(users_id);
    }
  }, [router.isReady, router.query.users_id]);

  async function fetchUserData(users_id: string) {
    try {
      const response = await axios.get(`https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${users_id}`);
      const data = response.data;
      setUser({
        users_id: data.users_id,
        role: data.role,
        firstName: data.first_name,
        lastName: data.last_name,
        birthday: dayjs(data.birthday),
        username: data.username,
        email: data.email,
        phoneNumber: data.phone_number,
        gender: data.gender,
        userImage: data.user_image,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      });
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      alert('Failed to load user data.');
    }
  }
  // const [selectedDate, setSelectedDate] = useState(dayjs());

  // const handleDateChange = (newValue) => {
  //   setSelectedDate(newValue);
  // };

  // const [user, setUser] = useState<UserData>({
  //   users_id: '',
  //   role: '',
  //   firstName: '',
  //   lastName: '',
  //   birthday: null,
  //   username: '',
  //   email: '',
  //   phoneNumber: '',
  //   gender: '',
  //   userImage: '',
  //   createdAt: '',
  //   updatedAt: ''
  // });

  // ตัวอย่างการใช้ DatePicker
  const handleDateChange = (date: Dayjs | null) => {
    setUser(prev => ({ ...prev, birthday: date }));
  };

  const handleBirthdayChange = (newDate: Dayjs | null) => {
    setUser({ ...user, birthday: newDate });
  };

  useEffect(() => {
    async function fetchUserData() {
      if (!user.users_id) {
        console.log("No user ID provided");
        return;
      }

      try {
        const response = await fetch(`https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${user.users_id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUser({
          users_id: data.users_id,
          role: data.role,
          firstName: data.first_name,
          lastName: data.last_name,
          birthday: dayjs(data.birthday),
          username: data.username,
          email: data.email,
          phoneNumber: data.phone_number,
          gender: data.gender,
          userImage: data.user_image,
          createdAt: data.created_at,
          updatedAt: data.updated_at
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        alert('Failed to load user data.'); // Display a simple alert or use a more sophisticated error display mechanism
      }
    }

    fetchUserData();
  }, [user.users_id]); // Only re-run the effect if user.users_id changes



  return (
    <>
      <form onSubmit={e => e.preventDefault()}>
        <Card>
          <CardHeader title="โปรไฟล์ผู้ใช้" subheader="ข้อมูลสามารถแก้ไขได้" />
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>ชื่อจริง</InputLabel>
                  <OutlinedInput label="ชื่อจริง" name="firstName" defaultValue={user.firstName} />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>นามสกุล</InputLabel>
                  <OutlinedInput label="นามสกุล" name="lastName" defaultValue={user.lastName} />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>อีเมล</InputLabel>
                  <OutlinedInput label="อีเมล" name="email" defaultValue={user.email} />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>หมายเลขโทรศัพท์</InputLabel>
                  <OutlinedInput label="หมายเลขโทรศัพท์" name="phoneNumber" defaultValue={user.phoneNumber} />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>ชื่อผู้ใช้</InputLabel>
                  <OutlinedInput label="ชื่อผู้ใช้" defaultValue={user.username} />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <DatePicker
                        label="วันเกิด"
                        value={user.birthday}
                        onChange={handleDateChange}
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">เพศ</FormLabel>
                  <RadioGroup
                    row
                    aria-label="เพศ"
                    name="gender"
                    value={user.gender}
                    onChange={(event) => setUser({ ...user, gender: event.target.value })}
                  >
                    <FormControlLabel value="male" control={<Radio />} label="ชาย" />
                    <FormControlLabel value="female" control={<Radio />} label="หญิง" />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Button type="submit" variant="contained">บันทึกข้อมูล</Button>
          </CardActions>
        </Card>
      </form>
      {/* <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
        {error}
      </Alert>
    </Snackbar> */}
    </>
  );
}
