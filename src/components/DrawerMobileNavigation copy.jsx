'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation'; // ใช้ useRouter จาก next/navigation
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Drawer from '@mui/joy/Drawer';
import Input from '@mui/joy/Input';
import List from '@mui/joy/List';
import ListItemButton from '@mui/joy/ListItemButton';
import Typography from '@mui/joy/Typography';
import ModalClose from '@mui/joy/ModalClose';
import MenuIcon from "@mui/icons-material/Menu";
import Search from '@mui/icons-material/Search';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AccessTimeFilled from '@mui/icons-material/AccessTimeFilled';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PostAddIcon from '@mui/icons-material/PostAdd';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function DrawerMobileNavigation() {
  const [open, setOpen] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const router = useRouter();

  const handleParticipatingClick = () => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

    router.push("/profile?tab=1");
  };

  const handleProfileClick = () => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

    router.push("/profile");
  };

  const handlePostMeClick = () => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

    router.push("/profile?tab=0");
  };

  const handleManageAccountsMeClick = () => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

    router.push("/profile?tab=2");
  };

  return (
    <React.Fragment>
      <IconButton onClick={() => setOpen(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            ml: 'auto',
            mt: 1,
            mr: 2,
          }}
        >
          <Typography
            component="label"
            htmlFor="close-icon"
            fontSize="sm"
            fontWeight="lg"
            sx={{ cursor: 'pointer' }}
          >
            ปิด
          </Typography>
          <ModalClose id="close-icon" sx={{ position: 'initial' }} />
        </Box>
        {/* <Input
          size="sm"
          placeholder="ค้นหาโพสต์"
          variant="plain"
          endDecorator={<Search />}
          slotProps={{
            input: {
              'aria-label': 'Search anything',
            },
          }}
          sx={{
            m: 3,
            borderRadius: 0,
            borderBottom: '2px solid',
            borderColor: 'neutral.outlinedBorder',
            '&:hover': {
              borderColor: 'neutral.outlinedHoverBorder',
            },
            '&::before': {
              border: '1px solid var(--Input-focusedHighlight)',
              transform: 'scaleX(0)',
              left: 0,
              right: 0,
              bottom: '-2px',
              top: 'unset',
              transition: 'transform .15s cubic-bezier(0.1,0.9,0.2,1)',
              borderRadius: 0,
            },
            '&:focus-within::before': {
              transform: 'scaleX(1)',
            },
          }}
        /> */}
        <List
          size="lg"
          component="nav"
          sx={{
            flex: 'none',
            fontSize: 'xl',
            '& > div': { justifyContent: 'left' },
          }}
        >
          <ListItemButton sx={{ fontWeight: 'lg' }} onClick={() => router.push('/')}><HomeRoundedIcon />หน้าแรก</ListItemButton>
          <ListItemButton onClick={handleProfileClick}><AccountCircleIcon />โปรไฟล์ของเรา</ListItemButton>
          <ListItemButton onClick={handlePostMeClick}><PostAddIcon />โพสต์ของเรา</ListItemButton>
          <ListItemButton onClick={handleParticipatingClick}><AccessTimeFilled />ประวัติการเข้าร่วม</ListItemButton>
          <ListItemButton onClick={handleManageAccountsMeClick}><ManageAccountsIcon />แก้ไขโปรไฟล์</ListItemButton>
          <ListItemButton onClick={() => router.push('/rules')}><InfoOutlined />กฏของเว็บไซต์</ListItemButton>
        </List>
      </Drawer>
      <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="warning">
          กรุณาเข้าสู่ระบบก่อน
        </Alert>
      </Snackbar>
    </React.Fragment>
  );
}
