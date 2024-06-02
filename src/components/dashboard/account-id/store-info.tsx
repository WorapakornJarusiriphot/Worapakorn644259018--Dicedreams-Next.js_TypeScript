'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface StoreInfoProps {
  storeId: string;
}

interface StoreData {
  name_store: string;
  phone_number: string;
  house_number: string;
  alley: string;
  road: string;
  district: string;
  sub_district: string;
  province: string;
  store_image: string;
  store_id: string;
}

export default function StoreInfo({ storeId }: StoreInfoProps) {
  const [store, setStore] = useState<StoreData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState<'success' | 'error'>('success');

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    const fetchStoreProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/store/${storeId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`
          }
        });

        if (response.status === 200) {
          setStore(response.data);
        } else {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching store profile:', error);
        setError(error.message);
      }
    };

    fetchStoreProfile();
  }, [storeId]);

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!store) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={store.store_image} sx={{ height: '80px', width: '80px' }}>
              {!store.store_image && `${store.name_store?.[0] ?? ''}`}
            </Avatar>
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{store.name_store}</Typography>
            <Typography color="text.secondary" variant="body2">เบอร์โทรศัพท์ : {store.phone_number}</Typography>
            <Typography color="text.secondary" variant="body2">ที่อยู่ : {`${store.house_number} ${store.alley} ${store.road} ${store.district} ${store.sub_district} ${store.province}`}</Typography>
          </Stack>
        </Stack>
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
