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
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Dayjs } from 'dayjs';
import { useRouter } from 'next/navigation';
import { useUser } from './UserContext';




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

import {
  Snackbar,
  Alert,
} from '@mui/material';



interface User {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  role: string;
  profilePictureUrl: string;
  phoneNumber: string;
  gender: string;
  birthday: Dayjs;
  users_id: string;
  userImage: string; // Add the 'userImage' property
}

interface Store {
  store_id: string;
  name_store: string;
  phone_number: string;
  house_number: string;
  alley: string;
  road: string;
  district: string;
  sub_district: string;
  province: string;
  store_image: string;
  users_id: string;
  createdAt: string;
  updatedAt: string;
}

interface AccountDetailsFormProps {
  user: User;
}

const AccountDetailsForm: React.FC = () => {
  const { user, setUser } = useUser();
  const [userData, setUserData] = useState(user);

  const [cleared, setCleared] = React.useState<boolean>(false);

  const [storeData, setStoreData] = useState<Store | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        throw new Error('Access token is missing');
      }

      const decodedToken: { users_id: string; store_id: string } = jwtDecode(accessToken);
      console.log("Decoded Token:", decodedToken);

      try {
        const userResponse = await axios.get(`http://localhost:8080/api/users/${decodedToken.users_id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        });
        setUser(userResponse.data);
        setUserData(userResponse.data);

        if (decodedToken.store_id) {
          const storeResponse = await axios.get(`http://localhost:8080/api/store/${decodedToken.store_id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            }
          });
          setStoreData(storeResponse.data);
          console.log('Store Data:', storeResponse.data);
        }
      } catch (error) {
        console.error('Error fetching user/store data:', error);
      }
    };

    fetchUserProfile();
  }, [setUser]);

  // const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target;
  //   setUserData((prevUser) => ({
  //     ...prevUser,
  //     [name]: value,
  //   }));
  // };

  // const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }
  //   setOpenSnackbar(false);
  // };

  // const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   try {
  //     const accessToken = localStorage.getItem("access_token");
  //     if (!accessToken) {
  //       throw new Error('Access token is missing');
  //     }

  //     const updatedUser = {
  //       ...userData,
  //     };

  //     await axios.put(`http://localhost:8080/api/users/${userData.users_id}`, updatedUser, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       }
  //     });

  //     setUser(updatedUser);
  //     setAlertMessage('ข้อมูลถูกอัพเดทเรียบร้อยแล้ว');
  //     setAlertSeverity('success');
  //     setOpenSnackbar(true);
  //   } catch (error) {
  //     console.error('Error updating user data:', error);
  //     setAlertMessage('เกิดข้อผิดพลาดในการอัพเดทข้อมูล');
  //     setAlertSeverity('error');
  //     setOpenSnackbar(true);
  //   }
  // };


  useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => { };
  }, [cleared]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error('Access token is missing');
      }

      const userImage = userData.userImage.startsWith('http://') || userData.userImage.startsWith('https://')
        ? userData.userImage.split('/').pop()!
        : userData.userImage;

      const updatedUser = {
        ...userData,
        userImage: userImage || '',
      };

      await axios.put(`http://localhost:8080/api/users/${userData.users_id}`, {
        first_name: updatedUser.firstName,
        last_name: updatedUser.lastName,
        username: updatedUser.username,
        email: updatedUser.email,
        birthday: updatedUser.birthday.format('MM/DD/YYYY'),
        phone_number: updatedUser.phoneNumber,
        gender: updatedUser.gender,
        user_image: updatedUser.userImage,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      });

      setUser(updatedUser); // อัปเดต context ทันทีหลังจากอัปเดตข้อมูลสำเร็จ
      setAlertMessage('ข้อมูลถูกอัพเดทเรียบร้อยแล้ว');
      setAlertSeverity('success');
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Error updating user data:', error);
      setAlertMessage('เกิดข้อผิดพลาดในการอัพเดทข้อมูล');
      setAlertSeverity('error');
      setOpenSnackbar(true);
    }
  };

  // const [user, setUserData] = useState({
  //   username: "",
  //   role: "",
  //   firstName: "",
  //   lastName: "",
  //   profilePictureUrl: "",
  // });

  // useEffect(() => {
  //   const accessToken = localStorage.getItem("access_token");
  //   if (accessToken) {
  //     const decodedToken = jwtDecode(accessToken);
  //     // สมมุติว่า token ของคุณมีข้อมูล users_id
  //     setUserData(prev => ({
  //       ...prev,
  //       firstName: decodedToken.firstName,
  //       lastName: decodedToken.lastName,
  //       email: decodedToken.email,
  //       users_id: decodedToken.users_id  // ตั้งค่า users_id
  //     }));
  //   }
  // }, []);

  // ...

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const decoded: JwtPayload & { users_id: string; lastName: string; email: string } = jwtDecode(accessToken);
      if (decoded && decoded.users_id) {
        setUserData(prev => ({
          ...prev,
          users_id: decoded.users_id
        }));
      }
    }
  }, []);

  const [openNav, setOpenNav] = useState(false);

  // const [openNav, setOpenNav] = React.useState<boolean>(false);

  // const userPopover = usePopover<HTMLDivElement>();

  const [open, setOpen] = React.useState(false);
  // const [userLoggedIn, setUserDataLoggedIn] = useState(false);
  // const [user, setUserData] = useState({ firstName: "", lastName: "", profilePictureUrl: "" });
  const router = useRouter();

  // const handleLogout = () => {
  //   localStorage.removeItem("access_token"); // ล้าง token ที่เก็บไว้
  //   setUserDataLoggedIn(false); // อัปเดต state
  //   setUserData({
  //     firstName: "",
  //     lastName: "",
  //     email: "",
  //     username: "",
  //     role: "",
  //     profilePictureUrl: "",
  //     phoneNumber: "",
  //     users_id: ""
  //   });
  //   router.push("/sign-in"); // เปลี่ยนเส้นทางไปยังหน้าล็อกอิน
  // };

  // const [open, setOpen] = React.useState(false);

  // State เพื่อบ่งบอกว่าผู้ใช้ล็อกอินหรือไม่
  const [userLoggedIn, setUserDataLoggedIn] = React.useState(false);

  // ตัวอย่าง URL รูปโปรไฟล์ หากมีระบบที่ให้ผู้ใช้เปลี่ยนรูปโปรไฟล์เอง ควรดึงจากฐานข้อมูล
  const profilePictureUrl = "/profile-pic-url.png";

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const [username, setUserDataname] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
      setUserDataname(decodedToken.users_id as string); // Add type annotation to 'users_id' parameter
    }
  }, []);

  // ประกาศฟังก์ชัน fetchUserProfile ก่อนใช้งานใน useEffect
  const fetchUserProfile = async (users_id: any, accessToken: string, decodedToken: { username: any; }) => {
    try {
      console.log(`Requesting URL: http://localhost:8080/api/users/${users_id}`);
      const response = await fetch(
        `http://localhost:8080/api/users/${users_id}`,
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
        setUserData(prev => ({
          ...prev,
          username: data.username,
          role: data.role,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email, // Add the missing 'email' property
          gender: data.gender,
          phoneNumber: data.phone_number,
          birthday: data.birthday,
          users_id: data.users_id, // Add the missing 'users_id' property
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
      const users_id = decodedToken.users_id;
      fetchUserProfile(users_id, accessToken, decodedToken);
    }
  }, []);


  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
          const users_id = decodedToken.users_id;

          if (!users_id) {
            console.error('User ID is missing in the token');
            return;
          }

          console.log(`Requesting URL: http://localhost:8080/api/users/${users_id}`);

          const response = await fetch(`http://localhost:8080/api/users/${users_id}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          console.log("API Response Status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("Profile Data:", data);

            setUserData({
              username: data.username,
              role: data.role,
              firstName: data.first_name,
              lastName: data.last_name,
              email: data.email,
              gender: data.gender,
              phoneNumber: data.phone_number,
              birthday: dayjs(data.birthday),
              users_id: data.users_id,
              profilePictureUrl: data.user_image || "",
              userImage: data.user_image || "", // กำหนดค่าให้กับ userImage
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


  const altText = `${userData.firstName || "User"} ${userData.lastName || ""}`;

  // ตัวอย่างการใช้ DatePicker
  // const handleDateChange = (newDate: Dayjs | null) => {
  //   setUserData((prev) => ({ ...prev, birthday: newDate }));
  // };

  console.log("User Role:", user.role); // เพิ่มการแสดงผล User Role

  return (
    <>
      <form onSubmit={handleSubmit}>
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
                    value={userData.firstName}
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
                    value={userData.lastName}
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
                    value={userData.email}
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
                    value={userData.phoneNumber}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-username" shrink>ชื่อผู้ใช้</InputLabel>
                <OutlinedInput
                  id="outlined-username"
                  label="ชื่อผู้ใช้"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                />
              </FormControl>
            </Grid>
            {storeData && (
                <>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel htmlFor="name_store">ชื่อร้าน</InputLabel>
                      <OutlinedInput
                        id="name_store"
                        label="ชื่อร้าน"
                        name="name_store"
                        value={storeData.name_store}
                        onChange={(e) => setStoreData({ ...storeData, name_store: e.target.value })}
                      />
                    </FormControl>
                  </Grid>
                  {/* <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="store_image">รูปภาพร้าน</InputLabel>
                      <OutlinedInput
                        id="store_image"
                        label="รูปภาพร้าน"
                        name="store_image"
                        value={storeData.store_image}
                        onChange={(e) => setStoreData({ ...storeData, store_image: e.target.value })}
                      />
                    </FormControl>
                  </Grid> */}
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="house_number">บ้านเลขที่</InputLabel>
                      <OutlinedInput
                        id="house_number"
                        label="บ้านเลขที่"
                        name="house_number"
                        value={storeData.house_number}
                        onChange={(e) => setStoreData({ ...storeData, house_number: e.target.value })}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="alley">ตรอก/ซอย</InputLabel>
                      <OutlinedInput
                        id="alley"
                        label="ตรอก/ซอย"
                        name="alley"
                        value={storeData.alley}
                        onChange={(e) => setStoreData({ ...storeData, alley: e.target.value })}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="road">ถนน</InputLabel>
                      <OutlinedInput
                        id="road"
                        label="ถนน"
                        name="road"
                        value={storeData.road}
                        onChange={(e) => setStoreData({ ...storeData, road: e.target.value })}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="sub_district">ตำบล/แขวง</InputLabel>
                      <OutlinedInput
                        id="sub_district"
                        label="ตำบล/แขวง"
                        name="sub_district"
                        value={storeData.sub_district}
                        onChange={(e) => setStoreData({ ...storeData, sub_district: e.target.value })}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="district">อำเภอ/เขต</InputLabel>
                      <OutlinedInput
                        id="district"
                        label="อำเภอ/เขต"
                        name="district"
                        value={storeData.district}
                        onChange={(e) => setStoreData({ ...storeData, district: e.target.value })}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="province">จังหวัด</InputLabel>
                      <OutlinedInput
                        id="province"
                        label="จังหวัด"
                        name="province"
                        value={storeData.province}
                        onChange={(e) => setStoreData({ ...storeData, province: e.target.value })}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Button type="submit" variant="contained">บันทึกข้อมูล</Button>
          </CardActions>
        </Card>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
          <Alert onClose={handleSnackbarClose} severity={alertSeverity} sx={{ width: '100%' }}>
            {alertMessage}
          </Alert>
        </Snackbar>
      </form>
    </>
  );
}

export default AccountDetailsForm;