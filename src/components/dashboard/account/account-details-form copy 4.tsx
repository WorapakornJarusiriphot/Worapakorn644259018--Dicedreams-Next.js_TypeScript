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
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker, DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { TextFieldProps } from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import axios, { AxiosError } from 'axios';
import { useState, useEffect } from 'react';
import { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';




import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Image from 'next/image';

// import mealIcon from '@/assets/icons/meal.png';
// import communityIcon from '@/assets/icons/community.png';
// import eventsIcon from '@/assets/icons/events.png';
// import classes from './page.module.css';

import type { Metadata } from 'next';

// import { config } from '@/config';
// import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
// export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;


// import Box from '@mui/material/Box';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import { usePopover } from "@/hook/use-popover";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";

import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";

import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import { Bell as BellIcon } from "@phosphor-icons/react/dist/ssr/Bell";
import { List as ListIcon } from "@phosphor-icons/react/dist/ssr/List";
import { MagnifyingGlass as MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Users as UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import Link from "next/link";

// import { MobileNav } from "@/layout/MobileNav";
import { UserPopover } from "@/layout/user-popover";

// import jwtDecode from 'jwt-decode';
import { jwtDecode } from "jwt-decode";
// import { JwtPayload } from 'jsonwebtoken';
import { JwtPayload } from 'jwt-decode';


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

export default function AccountDetailsForm(): JSX.Element {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: "",
    userType: "",
    profilePictureUrl: "",
    phoneNumber: "",
    gender: "",
    birthday: dayjs(),
    userId: ''  // เพิ่ม field userId
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // const [user, setUser] = useState({
  //   username: "",
  //   userType: "",
  //   firstName: "",
  //   lastName: "",
  //   profilePictureUrl: "",
  // });

  // useEffect(() => {
  //   const accessToken = localStorage.getItem("access_token");
  //   if (accessToken) {
  //     const decodedToken = jwtDecode(accessToken);
  //     // สมมุติว่า token ของคุณมีข้อมูล userId
  //     setUser(prev => ({
  //       ...prev,
  //       firstName: decodedToken.firstName,
  //       lastName: decodedToken.lastName,
  //       email: decodedToken.email,
  //       userId: decodedToken.userId  // ตั้งค่า userId
  //     }));
  //   }
  // }, []);

  // ...

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const decoded: JwtPayload & { userId: string; lastName: string; email: string } = jwtDecode(accessToken);
      if (decoded && decoded.userId) {
        setUser(prev => ({
          ...prev,
          userId: decoded.userId
        }));
      }
    }
  }, []);

  const [openNav, setOpenNav] = useState(false);

  // const [openNav, setOpenNav] = React.useState<boolean>(false);

  // const userPopover = usePopover<HTMLDivElement>();

  const [open, setOpen] = React.useState(false);
  // const [userLoggedIn, setUserLoggedIn] = useState(false);
  // const [user, setUser] = useState({ firstName: "", lastName: "", profilePictureUrl: "" });
  const router = useRouter();

  // const handleLogout = () => {
  //   localStorage.removeItem("access_token"); // ล้าง token ที่เก็บไว้
  //   setUserLoggedIn(false); // อัปเดต state
  //   setUser({
  //     firstName: "",
  //     lastName: "",
  //     email: "",
  //     username: "",
  //     userType: "",
  //     profilePictureUrl: "",
  //     phoneNumber: "",
  //     userId: ""
  //   });
  //   router.push("/sign-in"); // เปลี่ยนเส้นทางไปยังหน้าล็อกอิน
  // };

  // const [open, setOpen] = React.useState(false);

  // State เพื่อบ่งบอกว่าผู้ใช้ล็อกอินหรือไม่
  const [userLoggedIn, setUserLoggedIn] = React.useState(false);

  // ตัวอย่าง URL รูปโปรไฟล์ หากมีระบบที่ให้ผู้ใช้เปลี่ยนรูปโปรไฟล์เอง ควรดึงจากฐานข้อมูล
  const profilePictureUrl = "/profile-pic-url.png";

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const [username, setUsername] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
      setUsername(decodedToken.users_id as string); // Add type annotation to 'userId' parameter
    }
  }, []);

  // ประกาศฟังก์ชัน fetchUserProfile ก่อนใช้งานใน useEffect
  const fetchUserProfile = async (userId: any, accessToken: string, decodedToken: { username: any; }) => {
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
        setUser(prev => ({
          ...prev,
          username: data.username,
          userType: data.role,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email, // Add the missing 'email' property
          gender: data.gender,
          phoneNumber: data.phone_number,
          birthday: data.birthday,
          userId: data.users_id, // Add the missing 'userId' property
          profilePictureUrl: data.user_image || "",
        }));
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

  // Example code in Header.jsx
  useEffect(() => {
    const fetchUserProfile = async (_userId: undefined, accessToken: undefined, decodedToken: undefined) => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
          const userId = decodedToken.users_id;

          console.log(
            `Requesting URL: https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`
          );

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

            // ตั้งค่า profile image path และข้อมูลอื่นๆ
            setUser({
              username: data.username,
              userType: data.role, // ตรวจสอบและอัปเดต userType จาก API response
              firstName: data.first_name,
              lastName: data.last_name,
              email: data.email, // Add the missing 'email' property
              gender: data.gender, // Add the missing 'gender' property
              phoneNumber: data.phone_number,
              birthday: data.birthday,
              userId: data.users_id, // Add the missing 'userId' property
              profilePictureUrl: data.user_image || "",
            });
          } else {
            console.error(
              `API Error: ${response.status} ${response.statusText}`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    // Remove the unnecessary function call with undefined arguments
    // fetchUserProfile(undefined, undefined, undefined);
  }, []);

  const altText = `${user.firstName || "User"} ${user.lastName || ""}`;

  // ตัวอย่างการใช้ DatePicker
  // const handleDateChange = (newDate: Dayjs | null) => {
  //   setUser((prev) => ({ ...prev, birthday: newDate }));
  // };

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
                  <InputLabel htmlFor="firstName">ชื่อจริง</InputLabel>
                  <OutlinedInput
                    id="firstName"
                    label="ชื่อจริง"
                    name="firstName"
                    value={user.firstName}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel htmlFor="lastName">นามสกุล</InputLabel>
                  <OutlinedInput
                    id="lastName"
                    label="นามสกุล"
                    name="lastName"
                    value={user.lastName}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel htmlFor="email">อีเมล</InputLabel>
                  <OutlinedInput
                    id="email"
                    label="อีเมล"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="phoneNumber">หมายเลขโทรศัพท์</InputLabel>
                  <OutlinedInput
                    id="phoneNumber"
                    label="หมายเลขโทรศัพท์"
                    name="phoneNumber"
                    value={user.phoneNumber}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="username">ชื่อผู้ใช้</InputLabel>
                  <OutlinedInput
                    id="username"
                    label="ชื่อผู้ใช้"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>

              {/* <Grid item md={6} xs={12}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <DatePicker
                        label="วันเกิด"
                        value={user.birthday}
                        onChange={(newDate) => {
                          setUser((prev) => ({ ...prev, birthday: newDate }));
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </Grid>
                  </Grid>
                </LocalizationProvider>
              </Grid> */}
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
    </>
  );
}
