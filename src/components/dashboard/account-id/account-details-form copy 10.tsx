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

interface StoreData {
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
}

interface User {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  userType: string;
  profilePictureUrl: string;
  phoneNumber: string;
  gender: string;
  birthday: Dayjs;
  users_id: string;
  userImage: string; // Add the 'userImage' property
}

const AccountDetailsForm: React.FC = () => {
  const { user, setUser } = useUser();
  const [userData, setUserData] = useState<UserData>({
    ...user,
    role: user.role || '',
    createdAt: '',
    updatedAt: '',
  });
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  const [cleared, setCleared] = React.useState<boolean>(false);

  useEffect(() => {
    const fetchStoreData = async (storeId: string) => {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        setAlertMessage('Access token is missing');
        setAlertSeverity('error');
        setOpenSnackbar(true);
        return;
      }
      try {
        const response = await axios.get(`http://localhost:8080/api/store/${storeId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setStoreData(response.data);
      } catch (error) {
        console.error('Error fetching store data:', error);
        setAlertMessage('Error fetching store data');
        setAlertSeverity('error');
        setOpenSnackbar(true);
      }
    };

    if (user.role === 'store' && user.users_id) {
      fetchStoreData(user.users_id);
    }
  }, [user]);

  useEffect(() => {
    if (cleared) {
      const timeout = setTimeout(() => {
        setCleared(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [cleared]);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (user) {
      setUserData({
        ...user,
        createdAt: '',
        updatedAt: '',
      });
    }
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserData((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleStoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (storeData) {
      const { name, value } = event.target;
      setStoreData((prevStore) => ({
        ...prevStore,
        [name]: value as string, // Ensure value is a string
      }));
    }
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
      const accessToken = localStorage.getItem('access_token');
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

      await axios.put(
        `http://localhost:8080/api/users/${userData.users_id}`,
        {
          first_name: updatedUser.firstName,
          last_name: updatedUser.lastName,
          username: updatedUser.username,
          email: updatedUser.email,
          birthday: updatedUser.birthday?.format('MM/DD/YYYY'),
          phone_number: updatedUser.phoneNumber,
          gender: updatedUser.gender,
          user_image: updatedUser.userImage,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (user.role === 'store' && storeData) {
        await axios.put(
          `http://localhost:8080/api/store/${storeData.store_id}`,
          {
            name_store: storeData.name_store,
            phone_number: storeData.phone_number,
            house_number: storeData.house_number,
            alley: storeData.alley,
            road: storeData.road,
            district: storeData.district,
            sub_district: storeData.sub_district,
            province: storeData.province,
            store_image: storeData.store_image,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }

      setUser(updatedUser);
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

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      const decoded: JwtPayload & { users_id: string; lastName: string; email: string; store_id: string } = jwtDecode(accessToken);
      if (decoded && decoded.users_id) {
        setUserData((prev) => ({
          ...prev,
          users_id: decoded.users_id,
          role: 'store', // Ensure role is set to 'store' if it's a store user
        }));

        // Fetch store data if store_id is available
        if (decoded.store_id) {
          setStoreData({
            ...storeData,
            store_id: decoded.store_id,
          });
        }
      }
    }
  }, []);

  const altText = `${userData.firstName || 'User'} ${userData.lastName || ''}`;

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
                  <OutlinedInput id="firstName" label="ชื่อจริง" name="firstName" value={userData.firstName} onChange={handleChange} />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel htmlFor="lastName">นามสกุล</InputLabel>
                  <OutlinedInput id="lastName" label="นามสกุล" name="lastName" value={userData.lastName} onChange={handleChange} />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel htmlFor="email">อีเมล</InputLabel>
                  <OutlinedInput id="email" label="อีเมล" name="email" value={userData.email} onChange={handleChange} />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="phoneNumber">หมายเลขโทรศัพท์</InputLabel>
                  <OutlinedInput id="phoneNumber" label="หมายเลขโทรศัพท์" name="phoneNumber" value={userData.phoneNumber} onChange={handleChange} />
                </FormControl>
              </Grid>
              <Grid item md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="outlined-username" shrink>
                    ชื่อผู้ใช้
                  </InputLabel>
                  <OutlinedInput id="outlined-username" label="ชื่อผู้ใช้" name="username" value={userData.username} onChange={handleChange} />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">เพศ</FormLabel>
                  <RadioGroup
                    row
                    aria-label="เพศ"
                    name="gender"
                    value={userData.gender}
                    onChange={(event) => setUserData({ ...userData, gender: event.target.value })}
                  >
                    <FormControlLabel value="ชาย" control={<Radio />} label="ชาย" />
                    <FormControlLabel value="หญิง" control={<Radio />} label="หญิง" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              {user.role === 'store' && storeData && (
                <>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel htmlFor="name_store">ชื่อร้านค้า</InputLabel>
                      <OutlinedInput id="name_store" label="ชื่อร้านค้า" name="name_store" value={storeData.name_store} onChange={handleStoreChange} />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="store_phone_number">หมายเลขโทรศัพท์</InputLabel>
                      <OutlinedInput
                        id="store_phone_number"
                        label="หมายเลขโทรศัพท์"
                        name="phone_number"
                        value={storeData.phone_number}
                        onChange={handleStoreChange}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="house_number">เลขที่บ้าน</InputLabel>
                      <OutlinedInput id="house_number" label="เลขที่บ้าน" name="house_number" value={storeData.house_number} onChange={handleStoreChange} />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="alley">ซอย</InputLabel>
                      <OutlinedInput id="alley" label="ซอย" name="alley" value={storeData.alley} onChange={handleStoreChange} />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="road">ถนน</InputLabel>
                      <OutlinedInput id="road" label="ถนน" name="road" value={storeData.road} onChange={handleStoreChange} />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="district">อำเภอ</InputLabel>
                      <OutlinedInput id="district" label="อำเภอ" name="district" value={storeData.district} onChange={handleStoreChange} />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="sub_district">ตำบล</InputLabel>
                      <OutlinedInput id="sub_district" label="ตำบล" name="sub_district" value={storeData.sub_district} onChange={handleStoreChange} />
                    </FormControl>
                  </Grid>
                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                      <InputLabel htmlFor="province">จังหวัด</InputLabel>
                      <OutlinedInput id="province" label="จังหวัด" name="province" value={storeData.province} onChange={handleStoreChange} />
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
          </CardContent>
          <Divider />
          <CardActions>
            <Button type="submit" variant="contained">
              บันทึกข้อมูล
            </Button>
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
};

export default AccountDetailsForm;
