'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Box from '@mui/material/Box';
import { useUser } from './UserContext';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import dayjs, { Dayjs } from 'dayjs';

interface AccountInfoProps {
  userId?: string;
  storeId?: string;
}

export default function AccountInfo({ userId, storeId }: AccountInfoProps) {
  const { user, setUser } = useUser();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      const decoded: JwtPayload & { users_id: string } = jwtDecode(accessToken);
      if (decoded && decoded.users_id) {
        setUser((prev) => ({
          ...prev,
          users_id: decoded.users_id,
        }));
      } else {
        console.error('User ID is missing in the token');
      }
    }
  }, [setUser]);

  const fetchUserProfile = async (id: string, accessToken: string, isStore: boolean) => {
    try {
      const url = isStore ? `https://dicedreams-backend-deploy-to-render.onrender.com/api/store/${id}` : `https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${id}`;
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        if (isStore) {
          setUser((prev) => ({
            ...prev,
            userType: 'store',
            firstName: data.name_store,
            lastName: '',
            email: '',
            gender: '',
            phoneNumber: data.phone_number,
            birthday: null,
            userId: data.store_id,
            profilePictureUrl: data.store_image || '',
            storeAddress: `${data.house_number} ${data.alley} ${data.road} ${data.district} ${data.sub_district} ${data.province}`,
          }));
        } else {
          setUser((prev) => ({
            ...prev,
            userType: data.role,
            firstName: data.first_name,
            lastName: data.last_name,
            email: data.email,
            gender: data.gender,
            phoneNumber: data.phone_number,
            birthday: dayjs(data.birthday),
            userId: data.users_id,
            profilePictureUrl: data.user_image || '',
          }));
        }
      } else {
        console.error(`API Error: ${response.status} ${response.statusText}`);
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching profile:', error.message);
      } else {
        console.error('Error fetching profile:', error);
      }
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      if (userId) {
        fetchUserProfile(userId, accessToken, false);
      } else if (storeId) {
        fetchUserProfile(storeId, accessToken, true);
      }
    }
  }, [setUser, userId, storeId]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) return;

      try {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = async () => {
          const base64Image = reader.result as string;
          const formattedBirthday = user.birthday ? dayjs(user.birthday).format('YYYY-MM-DD') : '';
          const updatedUser = {
            first_name: user.firstName,
            last_name: user.lastName,
            username: user.username,
            email: user.email,
            birthday: formattedBirthday,
            phone_number: user.phoneNumber,
            gender: user.gender,
            user_image: base64Image,
          };

          if (!user.userId) {
            console.error('User ID is missing.');
            return;
          }

          const response = await axios.put(`https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${user.userId}`, updatedUser, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.status === 200) {
            setUser((prev) => ({
              ...prev,
              profilePictureUrl: base64Image,
              birthday: dayjs(formattedBirthday),
            }));
            setPreviewUrl(null);
            setSelectedFile(null);
            setAlertMessage('อัพโหลดรูปภาพสำเร็จแล้ว');
            setAlertSeverity('success');
            setOpenSnackbar(true);
          } else {
            console.error(`API Error: ${response.status} ${response.statusText}`);
            setAlertMessage('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ');
            setAlertSeverity('error');
            setOpenSnackbar(true);
          }
        };
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error uploading image:', error.message);
          setAlertMessage('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ');
        } else {
          console.error('Error uploading image:', error);
          setAlertMessage('เกิดข้อผิดพลาดที่ไม่รู้จักในการอัพโหลดรูปภาพ');
        }
        setAlertSeverity('error');
        setOpenSnackbar(true);
      }
    }
  };

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
            <Avatar src={previewUrl || user.profilePictureUrl} sx={{ height: '80px', width: '80px' }}>
              {!previewUrl && !user.profilePictureUrl && `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`}
            </Avatar>
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">
              {user.firstName} {user.lastName}
            </Typography>
            {user.userType === 'store' ? (
              <>
                <Typography color="text.secondary" variant="body2">
                  เบอร์โทรศัพท์ : {user.phoneNumber}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  ที่อยู่ : {user.storeAddress}
                </Typography>
              </>
            ) : (
              <>
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
              </>
            )}
          </Stack>
        </Stack>
        {previewUrl && (
          <Box mt={2} display="flex" justifyContent="center">
            <img src={previewUrl} alt="Preview" style={{ maxHeight: '200px', maxWidth: '100%' }} />
          </Box>
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
