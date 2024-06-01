import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Button from '@mui/material/Button';
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
  return (
    <Box sx={{ width: '100%', ...sx }}>
      {users.map((user, index) => (
        <Card key={user.users_id} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, padding: 2 }}>
          <ListItemAvatar>
            {user.user_image ? (
              <Box component="img" src={user.user_image} sx={{ borderRadius: 1, height: '48px', width: '48px' }} />
            ) : (
              <Box
                sx={{
                  borderRadius: 1,
                  backgroundColor: 'var(--mui-palette-neutral-200)',
                  height: '48px',
                  width: '48px',
                }}
              />
            )}
          </ListItemAvatar>
          <ListItemText
            primary={`${user.first_name} ${user.last_name}`}
            primaryTypographyProps={{ variant: 'subtitle1' }}
            secondary={`Updated ${user.updatedAt}`}
            secondaryTypographyProps={{ variant: 'body2' }}
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
      {stores.map((store, index) => (
        <Card key={store.store_id} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, padding: 2 }}>
          <ListItemAvatar>
            {store.store_image ? (
              <Box component="img" src={store.store_image} sx={{ borderRadius: 1, height: '48px', width: '48px' }} />
            ) : (
              <Box
                sx={{
                  borderRadius: 1,
                  backgroundColor: 'var(--mui-palette-neutral-200)',
                  height: '48px',
                  width: '48px',
                }}
              />
            )}
          </ListItemAvatar>
          <ListItemText
            primary={store.name_store}
            primaryTypographyProps={{ variant: 'subtitle1' }}
            secondary={`Updated ${store.updatedAt}`}
            secondaryTypographyProps={{ variant: 'body2' }}
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
    </Box>
  );
}

export default People;
