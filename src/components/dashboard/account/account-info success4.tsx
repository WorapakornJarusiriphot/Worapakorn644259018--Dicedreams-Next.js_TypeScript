'use client';

import * as React from 'react'; // เพิ่มการ import SetStateAction
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation'; // แก้ไขจาก next/navigation
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from 'jwt-decode';
import Box from '@mui/material/Box';
import { useUser } from './UserContext';
import { useStore } from './UserContext';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import dayjs, { Dayjs } from 'dayjs';
import BioComponent from './BioComponent';

export function AccountInfo(): React.JSX.Element {
  const { user, setUser } = useUser();
  const { store, setStore } = useStore(); // ไม่ต้องใส่ <Store | null>
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedStoreFile, setSelectedStoreFile] = useState<File | null>(null); // สำหรับรูปภาพร้านค้า
  const [previewStoreUrl, setPreviewStoreUrl] = useState<string | null>(null); // สำหรับตัวอย่างรูปภาพร้านค้า
  const [openNav, setOpenNav] = useState(false);
  const [open, setOpen] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');
  const router = useRouter();


  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      const decoded: JwtPayload & { users_id: string; store_id: string } = jwtDecode(accessToken);
      if (decoded && decoded.users_id) {
        setUser((prev) => ({
          ...prev,
          users_id: decoded.users_id,
        }));

        if (decoded.store_id) {
          fetchStoreProfile(decoded.store_id, accessToken); // Fetch store data
        } else {
          setStore(null as any); // แก้ไขโดยการ cast null เป็น any
        }
      } else {
        console.error('User ID is missing in the token');
      }
    }
  }, []);

  const fetchStoreProfile = async (storeId: string, accessToken: string) => {
    try {
      const response = await axios.get(`https://dicedreams-backend-deploy-to-render.onrender.com/api/store/${storeId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.status === 200) {
        setStore(response.data);
      } else {
        console.error(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching store profile:', error);
    }
  };

  const fetchUserProfile = async (userId: string, accessToken: string, decodedToken: { username: string }) => {
    try {
      const response = await fetch(`https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser((prev) => ({
          ...prev,
          username: decodedToken.username,
          role: data.role,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          gender: data.gender,
          phoneNumber: data.phone_number,
          birthday: dayjs(data.birthday), // แปลงเป็น Dayjs
          bio: data.bio,
          userId: data.users_id,
          profilePictureUrl: data.user_image || '',
        }));
      } else {
        console.error(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
      const userId = decodedToken.users_id;
      fetchUserProfile(userId, accessToken, decodedToken);
    }
  }, []);

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

  // ฟังก์ชันจัดการการเปลี่ยนรูปภาพร้านค้า
  const handleStoreFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedStoreFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewStoreUrl(reader.result as string);
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
          const formattedBirthday = user.birthday ? dayjs(user.birthday).format('MM-DD-YYYY') : '';
          const updatedUser = {
            first_name: user.firstName,
            last_name: user.lastName,
            username: user.username,
            email: user.email,
            birthday: formattedBirthday,
            phone_number: user.phoneNumber,
            gender: user.gender,
            bio: user.bio,
            user_image: base64Image,
          };

          if (!user.users_id) {
            console.error('User ID is missing.');
            return;
          }

          try {
            const response = await axios.put(`https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${user.users_id}`, updatedUser, {
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
          } catch (error) {
            if (axios.isAxiosError(error)) {
              console.error('API Error:', error.response?.data);
              setAlertMessage(`เกิดข้อผิดพลาด: ${error.response?.data.message || 'ไม่สามารถอัพเดตข้อมูลได้'}`);
            } else {
              console.error('Error:', error);
              setAlertMessage('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ');
            }
            setAlertSeverity('error');
            setOpenSnackbar(true);
          }
        };
      } catch (error) {
        console.error('Error uploading image:', error);
        setAlertMessage('เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ');
        setAlertSeverity('error');
        setOpenSnackbar(true);
      }
    }
  };

  // ฟังก์ชันอัพโหลดรูปภาพร้านค้า
  const handleStoreUpload = async () => {
    if (selectedStoreFile) {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) return;

      const reader = new FileReader();
      reader.readAsDataURL(selectedStoreFile);
      reader.onload = async () => {
        const base64StoreImage = reader.result as string;
        const updatedStore = {
          ...store,
          store_image: base64StoreImage,
        };

        try {
          const response = await axios.put(`https://dicedreams-backend-deploy-to-render.onrender.com/api/store/${store.store_id}`, updatedStore, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (response.status === 200) {
            setStore((prev) => ({ ...prev, store_image: base64StoreImage }));
            setAlertMessage('อัพโหลดรูปร้านค้าสำเร็จแล้ว');
            setAlertSeverity('success');
            setOpenSnackbar(true);
          } else {
            setAlertMessage('เกิดข้อผิดพลาดในการอัพโหลดรูปร้านค้า');
            setAlertSeverity('error');
            setOpenSnackbar(true);
          }
        } catch (error) {
          setAlertMessage('เกิดข้อผิดพลาดในการอัพโหลดรูปร้านค้า');
          setAlertSeverity('error');
          setOpenSnackbar(true);
        }
      };
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleStoreCancel = () => {
    setSelectedStoreFile(null);
    setPreviewStoreUrl(null);
  };

  // const handleLogout = () => {
  //   localStorage.removeItem('access_token');
  //   setUserLoggedIn(false);
  //   setUser({
  //     firstName: '',
  //     lastName: '',
  //     email: '',
  //     username: '',
  //     role: '',
  //     profilePictureUrl: '',
  //     users_id: '',
  //     phoneNumber: '',
  //     birthday: dayjs(),
  //     gender: '',
  //     userImage: '',
  //   });
  //   router.push('/sign-in');
  // };

  const altText = `${user.firstName || 'User'} ${user.lastName || ''}`;

  const formatDate = (date: any) => {
    const dayjsDate = dayjs(date);
    if (!dayjsDate.isValid()) return 'ไม่ระบุวันเกิด';
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('th-TH', options).format(dayjsDate.toDate());
    const yearBuddhistEra = dayjsDate.year() + 543;
    return formattedDate.replace(dayjsDate.year().toString(), yearBuddhistEra.toString());
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <>
            {/* แสดงข้อมูลผู้ใช้เฉพาะเมื่อมีข้อมูลผู้ใช้ */}
            {user && !store && (
              <div>
                <Avatar src={previewUrl || user.profilePictureUrl} sx={{ height: '80px', width: '80px' }}>
                  {!previewUrl && !user.profilePictureUrl && `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`}
                </Avatar>
              </div>
            )}

            {/* แสดงข้อมูลร้านค้าหากมีข้อมูลร้านค้า */}
            {store && (
              <div>
                <Avatar src={previewStoreUrl || store.store_image} sx={{ height: '80px', width: '80px' }}>
                  {!previewStoreUrl && !store.store_image && 'ไม่มีรูปร้าน'}
                </Avatar>
              </div>
            )}
          </>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              อีเมล : {user.email}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              เบอร์โทรศัพท์ : {user.phoneNumber} {/* แก้ไขชื่อคุณสมบัติ */}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              วันเกิด : {user.birthday ? formatDate(user.birthday) : 'ไม่ระบุวันเกิด'} {/* แก้ไขเพื่อแปลง Dayjs เป็น string */}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              เพศ : {user.gender}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              ประวัติ:
              {user.bio ? <BioComponent bio={user.bio} /> : 'คุณยังไม่ได้กรอกประวัติลงไป'}
            </Typography>

          </Stack>
        </Stack>
        {previewUrl && (
          <Box mt={2} display="flex" justifyContent="center">
            <img src={previewUrl} alt="Preview" style={{ maxHeight: '200px', maxWidth: '100%' }} />
          </Box>
        )}
        {store && (
          <Stack spacing={2} sx={{ mt: 3 }}>
            <Typography variant="h6">ข้อมูลร้านค้า</Typography>
            <Typography color="text.secondary" variant="body2">
              ชื่อร้านค้า : {store.name_store}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              เบอร์โทรร้านค้า : {store.phone_number}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              ที่อยู่ร้านค้า : {`${store.house_number} ${store.alley} ${store.road} ${store.district} ${store.sub_district} ${store.province}`}
            </Typography>
            {/* <Box display="flex" justifyContent="center">
              <img src={store.store_image} alt="Store" style={{ maxHeight: '200px', maxWidth: '100%' }} />
            </Box> */}
          </Stack>
        )}
      </CardContent>
      <Divider />
      <CardContent>
        {/* ส่วนของรูปภาพผู้ใช้ */}
        {/* <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <Avatar src={previewUrl || user.profilePictureUrl} sx={{ height: '80px', width: '80px' }}>
            {!previewUrl && !user.profilePictureUrl && `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`}
          </Avatar>
        </Stack> */}

        {/* การอัพโหลดรูปภาพผู้ใช้ */}
        {user && !store && (
          <>
            <CardActions>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="raised-button-file" style={{ width: '100%' }}>
                <Button fullWidth variant="outlined" component="span">เลือกรูปภาพ</Button>
              </label>
              <Button fullWidth variant="contained" color="primary" onClick={handleUpload} disabled={!selectedFile}>
                อัพโหลดรูปภาพ
              </Button>
              {previewUrl && (
                <Button fullWidth variant="contained" sx={{ backgroundColor: 'red', color: 'white' }} onClick={handleCancel}>
                  ยกเลิก
                </Button>
              )}
            </CardActions>
          </>
        )}

        {/* ส่วนของการอัพโหลดรูปร้านค้า */}
        {store && (
          <>
            {/* <Typography variant="h6">ข้อมูลร้านค้า</Typography>
            <Typography color="text.secondary">ชื่อร้านค้า: {store.name_store}</Typography> */}

            {/* การแสดงตัวอย่างรูปร้านค้า */}
            {/* <Stack spacing={2} sx={{ alignItems: 'center' }}>
              <Avatar src={previewStoreUrl || store.store_image} sx={{ height: '80px', width: '80px' }}>
                {!previewStoreUrl && !store.store_image && 'ไม่มีรูปร้าน'}
              </Avatar>
            </Stack> */}

            {/* การอัพโหลดรูปร้านค้า */}
            <CardActions>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-store-file"
                type="file"
                onChange={handleStoreFileChange}
              />
              <label htmlFor="raised-button-store-file" style={{ width: '100%' }}>
                <Button fullWidth variant="outlined" component="span">เลือกรูปร้าน</Button>
              </label>
              <Button fullWidth variant="contained" color="primary" onClick={handleStoreUpload} disabled={!selectedStoreFile}>
                อัพโหลดรูปร้าน
              </Button>
              {previewStoreUrl && (
                <Button fullWidth variant="contained" sx={{ backgroundColor: 'red', color: 'white' }} onClick={handleStoreCancel}>
                  ยกเลิก
                </Button>
              )}
            </CardActions>
          </>
        )}
      </CardContent>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}
