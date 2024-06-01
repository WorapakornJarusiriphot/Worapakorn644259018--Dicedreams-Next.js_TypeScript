import React from 'react';
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
  // รวม users และ stores เข้าด้วยกันแล้วเรียงลำดับตาม createdAt
  const combinedData = [...users, ...stores].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <Box sx={{ width: '100%', ...sx }}>
      {combinedData.map((item, index) => (
        <Card key={item.users_id || item.store_id} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, padding: 2 }}>
          <ListItemAvatar>
            <Avatar
              src={item.user_image || item.store_image}
              alt={`${item.first_name || item.name_store} ${item.last_name || ''}`}
            >
              {!item.user_image && !item.store_image &&
                `${item.first_name?.[0] ?? ""}${item.last_name?.[0] ?? ""}${item.name_store?.[0] ?? ""}`}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${item.first_name || item.name_store} ${item.last_name || ''}`}
            secondary={
              <>
                {item.role && <div>Role: {item.role}</div>}
                {item.username && <div>Username: {item.username}</div>}
                {item.email && <div>Email: {item.email}</div>}
                {item.phone_number && <div>Phone: {item.phone_number}</div>}
                {item.gender && <div>Gender: {item.gender}</div>}
                {item.birthday && <div>Birthday: {item.birthday}</div>}
                {item.house_number && <div>House Number: {item.house_number}</div>}
                {item.alley && <div>Alley: {item.alley}</div>}
                {item.road && <div>Road: {item.road}</div>}
                {item.district && <div>District: {item.district}</div>}
                {item.sub_district && <div>Sub District: {item.sub_district}</div>}
                {item.province && <div>Province: {item.province}</div>}
                <div>Created At: {item.createdAt}</div>
                <div>Updated At: {item.updatedAt}</div>
              </>
            }
            sx={{ marginLeft: 2 }}
          />
          <Button
            variant="contained"
            sx={{ marginLeft: 'auto', marginRight: 2 }}
          >
            {item.store_id ? 'ติดตาม' : 'เพิ่มเป็นเพื่อน'}
          </Button>
          <IconButton edge="end">
            <DotsThreeVerticalIcon weight="bold" />
          </IconButton>
        </Card>
      ))}
    </Box>
  );
}

export default People;