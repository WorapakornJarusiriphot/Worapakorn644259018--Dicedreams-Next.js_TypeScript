import React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import type { SxProps } from '@mui/material/styles';
import { DotsThreeVertical as DotsThreeVerticalIcon } from '@phosphor-icons/react/dist/ssr/DotsThreeVertical';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export interface User {
  users_id: string;
  role: string;
  first_name: string;
  last_name: string;
  birthday: string;
  username: string;
  email: string;
  phone_number: string;
  gender: string;
  user_image: string;
  createdAt: string;
  updatedAt: string;
}

export interface Store {
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

export interface PeopleProps {
  users: User[];
  stores: Store[];
  sx?: SxProps;
}

export function People({ users = [], stores = [], sx }: PeopleProps): React.JSX.Element {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

    router.push(`/profile/${id}`);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  // เรียงลำดับ stores ตาม createdAt จากเวลาล่าสุดไปหาเวลาเก่าสุด
  const sortedStores = [...stores].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  // เรียงลำดับ users ตาม createdAt จากเวลาล่าสุดไปหาเวลาเก่าสุด
  const sortedUsers = [...users].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <Box sx={{ width: '100%', ...sx }}>
        {sortedStores.map((store, index) => (
          <Card
            key={store.store_id}
            sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, padding: 2 }}
            onClick={(event) => handleCardClick(event, store.store_id)}
          >
            <ListItemAvatar>
              <Avatar
                src={store.store_image}
                alt={store.name_store}
              >
                {!store.store_image &&
                  `${store.name_store?.[0] ?? ""}`}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={store.name_store}
              secondary={
                <>
                  <div>เบอร์โทรศัพท์: {store.phone_number}</div>
                  <div>บ้านเลขที่: {store.house_number}</div>
                  <div>ซอย: {store.alley}</div>
                  <div>ถนน: {store.road}</div>
                  <div>เขต: {store.district}</div>
                  <div>ตำบล: {store.sub_district}</div>
                  <div>จังหวัด: {store.province}</div>
                  {/* <div>สร้างเมื่อ: {store.createdAt}</div>
                <div>อัปเดตเมื่อ: {store.updatedAt}</div> */}
                </>
              }
              sx={{ marginLeft: 2 }}
            />
            <Button
              variant="contained"
              sx={{ marginLeft: 'auto', marginRight: 2 }}
            >
              ติดตาม
            </Button>
            <IconButton edge="end">
              <DotsThreeVerticalIcon weight="bold" />
            </IconButton>
          </Card>
        ))}
        {sortedUsers.map((user, index) => (
          <Card
            key={user.users_id}
            sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, padding: 2 }}
            onClick={(event) => handleCardClick(event, user.users_id)}
          >
            <ListItemAvatar>
              <Avatar
                src={user.user_image}
                alt={`${user.first_name} ${user.last_name}`}
              >
                {!user.user_image &&
                  `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${user.first_name} ${user.last_name}`}
              secondary={
                <>
                  {/* <div>บทบาท: {user.role}</div>
                <div>ชื่อผู้ใช้: {user.username}</div> */}
                  <div>อีเมล: {user.email}</div>
                  <div>เบอร์โทรศัพท์: {user.phone_number}</div>
                  <div>เพศ: {user.gender}</div>
                  <div>วันเกิด: {user.birthday}</div>
                  {/* <div>สร้างเมื่อ: {user.createdAt}</div>
                <div>อัปเดตเมื่อ: {user.updatedAt}</div> */}
                </>
              }
              sx={{ marginLeft: 2 }}
            />
            <Button
              variant="contained"
              sx={{ marginLeft: 'auto', marginRight: 2 }}
            >
              เพิ่มเป็นเพื่อน
            </Button>
            <IconButton edge="end">
              <DotsThreeVerticalIcon weight="bold" />
            </IconButton>
          </Card>
        ))}
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="warning"
          sx={{ width: "100%" }}
        >
          กรุณาเข้าสู่ระบบก่อน
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default People;
