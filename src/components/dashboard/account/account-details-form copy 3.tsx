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

export default function AccountDetailsForm(): JSX.Element {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [routerReady, setRouterReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setRouterReady(router.isReady);
    }
  }, [isClient, router.isReady]);

  useEffect(() => {
    if (routerReady) {
      const users_id = router.query.users_id as string;
      if (users_id) {
        fetchUserData(users_id);
      }
    }
  }, [routerReady, router.query.users_id]);

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

  useEffect(() => {
    // ตั้งค่าเมื่อ component ได้ mount บน client-side
    setIsClient(true);
  }, []);

  useEffect(() => {
    // ตรวจสอบทั้งการพร้อมใช้งานของ router และการ mount บน client-side
    if (!router.isReady || !isClient) {
      return;
    }
    const users_id = router.query.users_id as string;
    if (users_id) {
      fetchUserData(users_id);
    }
  }, [router.isReady, router.query.users_id, isClient]);

  // useEffect(() => {
  //   if (router.isReady) {
  //     setIsReady(true);
  //   }
  // }, [router.isReady]);

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

    // ตรวจสอบสถานะของ router
    useEffect(() => {
      console.log("Router is ready:", router.isReady);
      console.log("Router query:", router.query);
    }, [router.isReady, router.query]);

  // // ตรวจสอบว่า router พร้อมใช้งานก่อนดึงข้อมูล
  // useEffect(() => {
  //   if (!router.isReady) return;

  //   const users_id = router.query.users_id as string;

  //   if (users_id) {
  //     fetchUserData(users_id);
  //   }
  // }, [router.isReady, router.query.users_id]);

  async function fetchUserData(users_id: string) {
    try {
      const response = await axios.get(`https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${users_id}`);
      const data = response.data;
      console.log("Fetched user data:", response.data);
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

  if (!routerReady) {
    return <div>Loading...</div>;
  }


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
    </>
  );
}
