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

import Image from 'next/image';

// import mealIcon from '@/assets/icons/meal.png';
// import communityIcon from '@/assets/icons/community.png';
// import eventsIcon from '@/assets/icons/events.png';
// import classes from './page.module.css';

import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';

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

import { useRouter } from "next/navigation"; // แก้ไขจาก next/navigation
import { useEffect, useState } from "react";
// import { MobileNav } from "@/layout/MobileNav";
import { UserPopover } from "@/layout/user-popover";

// import jwtDecode from 'jwt-decode';
import { jwtDecode } from "jwt-decode";
// import { JwtPayload } from 'jsonwebtoken';
import { JwtPayload } from 'jwt-decode';

export function AccountInfo(): React.JSX.Element {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    userType: '',
    profilePictureUrl: '',
    userId: '',
    PhoneNumber: '',
    birthday: '',
    gender: '',
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      const decoded = jwtDecode(accessToken) as JwtPayload & { userId: string; username: string; email: string };
      if (decoded && decoded.userId) {
        setUser((prev) => ({
          ...prev,
          userId: decoded.userId,
          username: decoded.username,
          email: decoded.email,
        }));
        fetchUserProfile(decoded.userId, accessToken);
      }
    }
  }, []);

  const fetchUserProfile = async (userId: string, accessToken: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUser((prev) => ({
          ...prev,
          userType: data.role,
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          gender: data.gender,
          PhoneNumber: data.phone_number,
          birthday: data.birthday,
          profilePictureUrl: data.user_image || '',
        }));
      } else {
        console.error(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

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

          // Check if all necessary fields are not empty
          if (!user.username || !user.firstName || !user.lastName || !user.email || !user.birthday || !user.PhoneNumber || !user.gender || !base64Image) {
            console.error('All fields are required');
            return;
          }

          const response = await fetch(`http://localhost:8080/api/users/${user.userId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              user_image: base64Image,
              username: user.username,
              first_name: user.firstName,
              last_name: user.lastName,
              email: user.email,
              birthday: user.birthday,
              phone_number: user.PhoneNumber,
              gender: user.gender,
            }),
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
            const errorResponse = await response.json();
            console.error(`API Error: ${response.status} ${response.statusText}`, errorResponse);
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
              เบอร์โทรศัพท์ : {user.PhoneNumber}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              วันเกิด : {formatDate(user.birthday)}
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
          <Button fullWidth variant="outlined" component="span" sx={{ height: '50px' }}>
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
