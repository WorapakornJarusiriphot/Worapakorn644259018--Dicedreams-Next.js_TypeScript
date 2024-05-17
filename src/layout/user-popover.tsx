import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { SignOut as SignOutIcon } from '@phosphor-icons/react/dist/ssr/SignOut';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { handleLogout } from './authUtils'; // ตรวจสอบ path ว่าถูกต้อง
import axios, { AxiosError } from 'axios';
// import jwtDecode from 'jwt-decode';
import { jwtDecode } from "jwt-decode";
// import { JwtPayload } from 'jsonwebtoken';
import { JwtPayload } from 'jwt-decode';
import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation'; // Import useRouter from next/router


// import { paths } from '@/paths';
// import { authClient } from '@/lib/auth/client';
// import { logger } from '@/lib/default-logger';
// import { useUser } from '@/hooks/use-user';

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
  userId: string;  // รับ userId ผ่าน props
}

export function UserPopover({ anchorEl, onClose, open, userId }: UserPopoverProps): React.JSX.Element {

  // const router = useRouter(); // ใช้ useRouter ในภายใน component function

  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string }>({
    firstName: '',
    lastName: '',
    email: ''
  });

  useEffect(() => {
    if (!userId) {
      console.error('UserID is undefined');
      return;
    }
    const fetchUser = async () => {
      const token = localStorage.getItem('access_token');  // ตรวจสอบและรับ token จาก localStorage
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`  // ส่ง token ไปกับ headers ของคำร้องขอ
          }
        });
        const { first_name, last_name, email } = response.data;
        setUser({ firstName: first_name, lastName: last_name, email: email });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        console.error('Response:', (error as AxiosError).response);
      }
    };

    fetchUser();
  }, [userId]);


  // const { checkSession } = useUser();

  // const handleSignOut = React.useCallback(async (): Promise<void> => {
  //   try {
  //     const { error } = await authClient.signOut();

  //     if (error) {
  //       logger.error('Sign out error', error);
  //       return;
  //     }

  //     // Refresh the auth state
  //     await checkSession?.();

  //     // UserProvider, for this case, will not refresh the router and we need to do it manually
  //     router.refresh();
  //     // After refresh, AuthGuard will handle the redirect
  //   } catch (err) {
  //     logger.error('Sign out error', err);
  //   }
  // }, [checkSession, router]);

  const [storeId, setStoreId] = React.useState(''); // Set storeId dynamically

  React.useEffect(() => {
    // กำหนดประเภทของข้อมูลใน JWT
    interface DecodedToken extends JwtPayload {
      store_id: string;
    }

    const token = localStorage.getItem('access_token');

    if (token) {
      try {
        // แปลงโทเค็นเป็นประเภท DecodedToken
        const decoded = jwtDecode<DecodedToken>(token);
        console.log('Decoded token:', decoded);
        setStoreId(decoded.store_id); // ตั้งค่า storeId
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    } else {
      console.error('JWT Token is missing');
    }
  }, []);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '240px' } } }}
    >
      <Box sx={{ p: '16px 20px ' }}>
        <Typography variant="subtitle1">{user.firstName} {user.lastName}</Typography>
        <Typography color="text.secondary" variant="body2">
          {user.email}
        </Typography>
      </Box>
      <Divider />
      <MenuList disablePadding sx={{ p: '8px', '& .MuiMenuItem-root': { borderRadius: 1 } }}>
        <MenuItem component={RouterLink} href="/settings" onClick={onClose}>
          <ListItemIcon>
            <GearSixIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          ตั้งค่า
        </MenuItem>
        <MenuItem component={RouterLink} href="/profile" onClick={onClose}>
          <ListItemIcon>
            <UserIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          โปรไฟล์
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <SignOutIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          ออกจากระบบ
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
