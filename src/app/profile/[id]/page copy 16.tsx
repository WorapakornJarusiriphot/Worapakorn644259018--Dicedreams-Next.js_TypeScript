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
        const response = await axios.get(`https://dicedreams-backend-deploy-to-render.onrender.com/api/store/${id}`);
        if (response.status === 200) {
          setIsStoreId(true);
        } else {
          setIsStoreId(false);
        }
      } catch (error) {
        setIsStoreId(false);
      }
    };

    checkId();
  }, [id]);

  if (isStoreId === null) {
    return <div>Loading...</div>;
  }

  const userId = !isStoreId ? id : '';
  const storeId = isStoreId ? id : '';

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
                    <StoreInfo storeId={storeId} />
                  </Grid>
                  <Grid xs={12}>
                    <TabsProfileStore storeId={storeId} userId={userId} />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid xs={12}>
                    <AccountInfo userId={userId} />
                  </Grid>
                  <Grid xs={12}>
                    <TabsProfile userId={userId} storeId={storeId} />
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