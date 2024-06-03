'use client';

import * as React from 'react';
import { useParams } from 'next/navigation'; // ใช้ useParams แทน useRouter
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import TabsProfile from './TabsProfile';
import TabsProfileStore from './TabsProfileStore';
import { UserProvider } from '@/components/dashboard/account-id/UserContext';
import AccountInfo from '@/components/dashboard/account-id/account-info';
import StoreInfo from '@/components/dashboard/account-id/store-info';

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#fff",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& label": {
            color: "white",
          },
          "& .MuiInputBase-root": {
            color: "white",
            "& fieldset": {
              borderColor: "white",
            },
          },
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "white",
            },
            "&.Mui-focused fieldset": {
              borderColor: "white",
            },
          },
        },
      },
    },
  },
});


export default function ProfileID() {
  const params = useParams();
  const id = params?.id as string;

  const isStoreId = (id: string) => {
    // สมมติว่า store_id มีรูปแบบเฉพาะที่สามารถตรวจสอบได้
    // เปลี่ยนแปลงได้ตามเงื่อนไขที่ต้องการ เช่นการตรวจสอบรูปแบบ UUID
    return id.includes('store');
  };

  const userId = isStoreId(id) ? undefined : id;
  const storeId = isStoreId(id) ? id : undefined;

  return (
    <>
      <UserProvider>
        <ThemeProvider theme={darkTheme}>
          <br />
          <br />
          <br />
          <br />
          <Stack spacing={3}>
            <Grid container spacing={3}>
              {isStoreId(id) ? (
                <>
                  <Grid xs={12}>
                    <StoreInfo storeId={storeId!} userId={userId!} />
                  </Grid>
                  <Grid xs={12}>
                    <TabsProfileStore storeId={storeId!} userId={userId!} />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid xs={12}>
                    <AccountInfo userId={userId!} storeId={storeId!} />
                  </Grid>
                  <Grid xs={12}>
                    <TabsProfile userId={userId!} storeId={storeId!} />
                  </Grid>
                </>
              )}
            </Grid>
          </Stack>
        </ThemeProvider>
      </UserProvider>
    </>
  );
}