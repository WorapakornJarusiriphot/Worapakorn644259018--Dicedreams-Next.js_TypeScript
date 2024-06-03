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
import axios from 'axios';

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
  const [isStoreId, setIsStoreId] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkId = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/store/${id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.store_id) {
            setIsStoreId(true);
            console.log("This is a store_id");
          } else {
            setIsStoreId(false);
            console.log("This is not a store_id");
          }
        } else {
          setIsStoreId(false);
          console.log("This is not a store_id");
        }
      } catch (error) {
        setIsStoreId(false);
        console.log("This is not a store_id");
      }
    };

    checkId();
  }, [id]);

  if (isStoreId === null) {
    return <div>Loading...</div>; // แสดงข้อความโหลดในขณะที่ตรวจสอบ ID
  }

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
              {isStoreId ? (
                <>
                  <Grid xs={12}>
                    <StoreInfo storeId={id} />
                  </Grid>
                  <Grid xs={12}>
                    <TabsProfileStore storeId={id} />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid xs={12}>
                    <AccountInfo userId={id} />
                  </Grid>
                  <Grid xs={12}>
                    <TabsProfile userId={id} />
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
