'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Box from '@mui/material/Box';
import { useUser } from './UserContext';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import dayjs, { Dayjs } from 'dayjs';
import { JwtPayload } from 'jwt-decode';



interface StoreInfoProps {
  storeId: string;
}

export default function StoreInfo({ storeId }: StoreInfoProps) {
  const { user, setUser } = useUser();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const [storeInfo, setStoreInfo] = useState<any>(null);
  const router = useRouter();

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const fetchUserProfile = async (userId: string, accessToken: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser((prev) => ({
          ...prev,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          gender: data.gender,
          phoneNumber: data.phone_number,
          birthday: dayjs(data.birthday),
          userId: data.users_id,
          profilePictureUrl: data.user_image || '',
        }));
      } else {
        console.error(`API Error: ${response.status} ${response.statusText}`);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching user profile:', error.message);
      } else {
        console.error('Error fetching user profile:', error);
      }
    }
  };

  const fetchStoreInfo = async (storeId: string, accessToken: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/store/${storeId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setStoreInfo(data);
        // ดึงข้อมูลผู้ใช้จาก users_id ที่เชื่อมกับ store_id
        fetchUserProfile(data.users_id, accessToken);
      } else {
        console.error(`API Error: ${response.status} ${response.statusText}`);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching store info:', error.message);
      } else {
        console.error('Error fetching store info:', error);
      }
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      fetchStoreInfo(storeId, accessToken);
    }
  }, [setUser, storeId]);


  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const altText = `${user.firstName || 'User'} ${user.lastName || ''}`;

  const formatDate = (date: Dayjs) => {
    if (!date) return 'ไม่ระบุวันเกิด';
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('th-TH', options).format(date.toDate());
    const yearBuddhistEra = date.year() + 543;
    return formattedDate.replace(date.year().toString(), yearBuddhistEra.toString());
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={previewUrl || (storeInfo ? storeInfo.store_image : user.profilePictureUrl)} sx={{ height: '80px', width: '80px' }}>
              {!previewUrl && !(storeInfo ? storeInfo.store_image : user.profilePictureUrl) && `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`}
            </Avatar>
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              อีเมล : {user.email}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              เบอร์โทรศัพท์ : {user.phoneNumber}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              วันเกิด : {user.birthday ? formatDate(user.birthday) : 'ไม่ระบุวันเกิด'}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              เพศ : {user.gender}
            </Typography>
          </Stack>
        </Stack>
        {previewUrl && (
          <Box mt={2} display="flex" justifyContent="center">
            <img src={previewUrl} alt="Preview" style={{ maxHeight: '200px', maxWidth: '100%' }} />
          </Box>
        )}
        {storeInfo && (
          <Stack spacing={2} sx={{ mt: 3 }}>
            <Typography variant="h6">ข้อมูลร้านค้า</Typography>
            <Typography color="text.secondary" variant="body2">
              ชื่อร้านค้า : {storeInfo.name_store}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              เบอร์โทรร้านค้า : {storeInfo.phone_number}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              ที่อยู่ร้านค้า : {`${storeInfo.house_number} ${storeInfo.alley} ${storeInfo.road} ${storeInfo.district} ${storeInfo.sub_district} ${storeInfo.province}`}
            </Typography>
            {/* <Box display="flex" justifyContent="center">
              <img src={storeInfo.store_image} alt="Store" style={{ maxHeight: '200px', maxWidth: '100%' }} />
            </Box> */}
          </Stack>
        )}
      </CardContent>
      <Divider />
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}
