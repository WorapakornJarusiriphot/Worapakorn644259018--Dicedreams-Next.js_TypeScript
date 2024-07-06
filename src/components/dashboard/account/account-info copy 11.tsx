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
import { useRouter } from 'next/navigation'; // แก้ไขจาก next/navigation
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from 'jwt-decode';
import Box from '@mui/material/Box';
import { useUser } from './UserContext';

export function AccountInfo(): React.JSX.Element {
  const { user, setUser } = useUser();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [openNav, setOpenNav] = useState(false);
  const [open, setOpen] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      const decoded: JwtPayload & { userId: string; lastName: string; email: string } = jwtDecode(accessToken);
      if (decoded && decoded.userId) {
        setUser((prev) => ({
          ...prev,
          userId: decoded.userId,
        }));
      }
    }
  }, []);

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
          userType: data.role,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          gender: data.gender,
          phoneNumber: data.phone_number,
          birthday: data.birthday,
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

  const handleUpload = async () => {
    if (selectedFile) {
      const accessToken = localStorage.getItem('access_token');
      if (!accessToken) return;

      try {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = async () => {
          const base64Image = reader.result as string;
          const response = await fetch('https://dicedreams-backend-deploy-to-render.onrender.com/api/users', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ user_image: base64Image }),
          });

          if (response.ok) {
            const data = await response.json();
            setUser((prev) => ({
              ...prev,
              profilePictureUrl: data.user_image,
            }));
            setPreviewUrl(null);
            setSelectedFile(null);
          } else {
            console.error(`API Error: ${response.status} ${response.statusText}`);
          }
        };
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // const handleLogout = () => {
  //   localStorage.removeItem('access_token');
  //   setUserLoggedIn(false);
  //   setUser({
  //     firstName: '',
  //     lastName: '',
  //     email: '',
  //     username: '',
  //     userType: '',
  //     profilePictureUrl: '',
  //     userId: '',
  //     phoneNumber: '',
  //     birthday: '',
  //     gender: '',
  //   });
  //   router.push('/sign-in');
  // };

  const altText = `${user.firstName || 'User'} ${user.lastName || ''}`;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'ไม่ระบุวันเกิด';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'ไม่ระบุวันเกิด';
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Intl.DateTimeFormat('th-TH', options).format(date);
    const yearBuddhistEra = date.getFullYear() + 543;
    return formattedDate.replace(date.getFullYear().toString(), yearBuddhistEra.toString());
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
            <Typography color="text.secondary" variant="body2">
              อีเมล : {user.email}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              เบอร์โทรศัพท์ : {user.phoneNumber} {/* แก้ไขชื่อคุณสมบัติ */}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              วันเกิด : {formatDate(user.birthday.toString())} {/* แก้ไขเพื่อแปลง Dayjs เป็น string */}
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
      </CardContent>
      <Divider />
      <CardActions>
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file" style={{ width: '100%' }}>
          <Button fullWidth variant="outlined" component="span" >
            เลือกรูปภาพ
          </Button>
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
    </Card>
  );
}
