'use client';

import Image from 'next/image';

// import mealIcon from '@/assets/icons/meal.png';
// import communityIcon from '@/assets/icons/community.png';
// import eventsIcon from '@/assets/icons/events.png';
// import classes from './page.module.css';

import * as React from 'react';
import type { Metadata } from 'next';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';

// import { config } from '@/config';
import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';

// export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;


// import Box from '@mui/material/Box';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import TabsProfile from './TabsProfile';

// TODO remove, this demo shouldn't need to reset the theme.
// กำหนดธีมสีเข้ม
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

export default function Profile() {

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <br />
        <br />
        <br />
        <br />
        <Stack spacing={3}>
          {/* <div>
            <Typography variant="h4" style={{ color: 'white', textAlign: 'center' }}>โปรไฟล์</Typography>
          </div> */}
          <Grid container spacing={3}>
            {/* <Grid lg={4} md={6} xs={12}> */}
            <Grid xs={12}>
              <AccountInfo />
            </Grid>

            <Grid xs={12}>
              <TabsProfile />
            </Grid>

            {/* <Grid lg={8} md={6} xs={12}> */}
            {/* <Grid xs={12}>
              <AccountDetailsForm />
            </Grid> */}
          </Grid>
        </Stack>
      </ThemeProvider>
    </>
  );
}
