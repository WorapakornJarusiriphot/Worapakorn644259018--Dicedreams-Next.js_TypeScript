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
import Grid from '@mui/material/Unstable_Grid2';



import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
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

import { useRouter } from 'next/navigation'; // Import useRouter from next/router

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


const states = [
  { value: 'alabama', label: 'Alabama' },
  { value: 'new-york', label: 'New York' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'los-angeles', label: 'Los Angeles' },
] as const;

// interface UserData {
//   first_name: string;
//   last_name: string;
//   username: string;
//   password: string;
//   email: string;
//   birthday?: string;
//   phone_number?: string;
//   gender?: string;
//   role: string;
//   firstName: string;
//   lastName: string;
//   userType: string;
//   profilePictureUrl: string;
//   userId: string;
// }

// interface UserData {
//   firstName: string;
//   lastName: string;
//   username: string;
//   password: string;
//   email: string;
//   birthday?: string;
//   phone_number?: string;
//   gender?: string;
//   role: string;
//   userType: string;
//   profilePictureUrl: string;
//   userId: string;
// }

interface UserData {
  username: string;
  password: string;
  email: string;
  role: string;
  userId: string;
  userType: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  birthday?: string;
  phone_number?: string;
  gender?: string;
}

export function AccountDetailsForm(): React.JSX.Element {
  const [birthday, setBirthday] = React.useState<string | null>(null);

  // Capture the date selected in the DatePicker
  const handleBirthdayChange = (date: dayjs.Dayjs | null) => {
    // Change the format to MM-DD-YYYY
    setBirthday(date ? date.format('MM-DD-YYYY') : null);
  };


  const [cleared, setCleared] = React.useState<boolean>(false);

  const [user, setUser] = useState<UserData>({
    firstName: '',
    lastName: '',
    password: '',
    role: '',
    email: '',
    username: '',
    userType: '',
    profilePictureUrl: '',
    userId: ''  // ใช้ field userId
  });

  // ขยายอินเทอร์เฟส JwtPayload เพื่อรวมฟิลด์ที่ต้องการ
  interface JwtPayload extends OriginalJwtPayload {
    users_id?: string;  // สมมุติว่า token มีฟิลด์ users_id
    firstName?: string;
    lastName?: string;
    email?: string;
  }

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const decoded = jwtDecode<JwtPayload>(accessToken);
      if (decoded && decoded.users_id) {
        setUser(prev => ({
          ...prev,
          firstName: decoded.firstName ?? "",  // ใช้ค่าเริ่มต้นเป็น string ว่างหาก firstName ไม่มี
          lastName: decoded.lastName ?? "",  // ใช้ค่าเริ่มต้นเป็น string ว่างหาก lastName ไม่มี
          email: decoded.email ?? "",  // ใช้ค่าเริ่มต้นเป็น string ว่างหาก email ไม่มี
          userId: decoded.users_id ?? ""  // ใช้ค่าเริ่มต้นเป็น string ว่างหาก users_id ไม่มี
        }));
      }
    }
  }, []);


  const [openNav, setOpenNav] = useState(false);

  const [open, setOpen] = React.useState(false);

  const router = useRouter();

  const [userLoggedIn, setUserLoggedIn] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const [username, setUsername] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
      setUsername(decodedToken.users_id); // สมมุติว่ามี username ใน token
    }
  }, []);

  // ประกาศฟังก์ชัน fetchUserProfile ก่อนใช้งานใน useEffect
  const fetchUserProfile = async (userId: string, accessToken: string, decodedToken: { username?: string }) => {
    try {
      console.log(`Requesting URL: https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`);
      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("API Response Status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Profile Data:", data);
        setUser({
          username: decodedToken.username || "",  // ใช้ค่าเริ่มต้นถ้าไม่มีข้อมูล
          userType: data.role,  // ตรวจสอบและอัปเดต userType จาก API response
          firstName: data.first_name,
          lastName: data.last_name,
          profilePictureUrl: data.user_image || "",
          // คุณต้องใส่ค่าเริ่มต้นสำหรับฟิลด์ที่หายไป
          password: "",
          email: "",
          role: "",
          userId: userId  // อาจต้องปรับปรุงตามโครงสร้างข้อมูลที่ได้รับจาก API
        });
      } else {
        console.error(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
      const userId = decodedToken.users_id;
      fetchUserProfile(userId, accessToken, decodedToken);
    }
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
          const userId = decodedToken.users_id;

          console.log(`Requesting URL: https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`);

          const response = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          console.log("API Response Status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("Profile Data:", data);

            setUser({
              username: decodedToken.username || "",
              userType: data.role || "",
              firstName: data.first_name || "",
              lastName: data.last_name || "",
              profilePictureUrl: data.user_image || "",
              password: "", // ให้ค่าเริ่มต้นเป็นสตริงว่างหรือค่าที่เหมาะสม
              email: "", // ให้ค่าเริ่มต้นเป็นสตริงว่างหรือค่าที่เหมาะสม
              role: "", // ให้ค่าเริ่มต้นเป็นสตริงว่างหรือค่าที่เหมาะสม
              userId: userId || "" // ใช้ userId ที่ได้จาก decodedToken
            });
          } else {
            console.error(`API Error: ${response.status} ${response.statusText}`);
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const altText = `${user.firstName || "User"} ${user.lastName || ""}`;


  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        <CardHeader subheader="ข้อมูลสามารถแก้ไขได้" title="โปรไฟล์" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>ชื่อจริง</InputLabel>
                <OutlinedInput defaultValue="Sofia" label="ชื่อจริง" name="firstName" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>นามสกุล</InputLabel>
                <OutlinedInput defaultValue="Rivers" label="นามสกุล" name="lastName" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>อีเมล</InputLabel>
                <OutlinedInput defaultValue="sofia@devias.io" label="อีเมล" name="email" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>หมายเลขโทรศัพท์</InputLabel>
                <OutlinedInput label="หมายเลขโทรศัพท์" name="phone" type="tel" />
              </FormControl>
            </Grid>
            {/* <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select defaultValue="New York" label="State" name="state" variant="outlined">
                  {states.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>ชื่อผู้ใช้</InputLabel>
                <OutlinedInput label="ชื่อผู้ใช้" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>รหัสผ่าน</InputLabel>
                <OutlinedInput label="รหัสผ่าน" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
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
            <Grid xs={12}>
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
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">Save details</Button>
        </CardActions>
      </Card>
    </form>
  );
}
