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
// import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form';
import { AccountInfo } from '@/components/dashboard/account/account-info';

// export const metadata = { title: `Account | Dashboard | ${config.site.name}` } satisfies Metadata;


// import Box from '@mui/material/Box';
// import Tabs from '@mui/material/Tabs';
// import Tab from '@mui/material/Tab';

import { createTheme, ThemeProvider } from '@mui/material/styles';

import TabsProfile from './TabsProfile';

import { usePopover } from "@/hook/use-popover";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar"; // ใช้สำหรับโปรไฟล์

import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import { Bell as BellIcon } from "@phosphor-icons/react/dist/ssr/Bell";
import { List as ListIcon } from "@phosphor-icons/react/dist/ssr/List";
import { MagnifyingGlass as MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Users as UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import Link from "next/link";

import { useRouter } from "next/navigation"; // แก้ไขจาก next/navigation
import { useEffect, useState } from "react";
// import { MobileNav } from "@/layout/MobileNav";
import { UserPopover } from "@/layout/user-popover";

// import jwtDecode from 'jwt-decode';
import { jwtDecode } from "jwt-decode";
// import { JwtPayload } from 'jsonwebtoken';
import { JwtPayload } from 'jwt-decode';

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
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: "",
    userType: "",
    profilePictureUrl: "",
    userId: ''  // เพิ่ม field userId
  });

  // const [user, setUser] = useState({
  //   username: "",
  //   userType: "",
  //   firstName: "",
  //   lastName: "",
  //   profilePictureUrl: "",
  // });

  // useEffect(() => {
  //   const accessToken = localStorage.getItem("access_token");
  //   if (accessToken) {
  //     const decodedToken = jwtDecode(accessToken);
  //     // สมมุติว่า token ของคุณมีข้อมูล userId
  //     setUser(prev => ({
  //       ...prev,
  //       firstName: decodedToken.firstName,
  //       lastName: decodedToken.lastName,
  //       email: decodedToken.email,
  //       userId: decodedToken.userId  // ตั้งค่า userId
  //     }));
  //   }
  // }, []);

      // ...

      useEffect(() => {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          const decoded: JwtPayload & { userId: string; lastName: string; email: string } = jwtDecode(accessToken);
          if (decoded && decoded.userId) {
            setUser(prev => ({
              ...prev,
              userId: decoded.userId
            }));
          }
        }
      }, []);

  const [openNav, setOpenNav] = useState(false);

  // const [openNav, setOpenNav] = React.useState<boolean>(false);

  // const userPopover = usePopover<HTMLDivElement>();

  const [open, setOpen] = React.useState(false);
  // const [userLoggedIn, setUserLoggedIn] = useState(false);
  // const [user, setUser] = useState({ firstName: "", lastName: "", profilePictureUrl: "" });
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access_token"); // ล้าง token ที่เก็บไว้
    setUserLoggedIn(false); // อัปเดต state
    setUser({
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      userType: "",
      profilePictureUrl: "",
      userId: ""
    });
    router.push("/sign-in"); // เปลี่ยนเส้นทางไปยังหน้าล็อกอิน
  };

  // const [open, setOpen] = React.useState(false);

  // State เพื่อบ่งบอกว่าผู้ใช้ล็อกอินหรือไม่
  const [userLoggedIn, setUserLoggedIn] = React.useState(false);

  // ตัวอย่าง URL รูปโปรไฟล์ หากมีระบบที่ให้ผู้ใช้เปลี่ยนรูปโปรไฟล์เอง ควรดึงจากฐานข้อมูล
  const profilePictureUrl = "/profile-pic-url.png";

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const [username, setUsername] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
      setUsername(decodedToken.users_id as string); // Add type annotation to 'userId' parameter
    }
  }, []);

  // ประกาศฟังก์ชัน fetchUserProfile ก่อนใช้งานใน useEffect
  const fetchUserProfile = async (userId: any, accessToken: string, decodedToken: { username: any; }) => {
    try {
      console.log(`Requesting URL: http://localhost:8080/api/users/${userId}`);
      const response = await fetch(
        `http://localhost:8080/api/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("API Response Status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Profile Data:", data);
        setUser(prev => ({
          ...prev,
          username: decodedToken.username,
          userType: data.role,
          firstName: data.first_name,
          lastName: data.last_name,
          email: "", // Add the missing 'email' property
          userId: "", // Add the missing 'userId' property
          profilePictureUrl: data.user_image || "",
        }));
      } else {
        console.error(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
      const userId = decodedToken.users_id;
      fetchUserProfile(userId, accessToken, decodedToken);
    }
  }, []);

  // Example code in Header.jsx
  useEffect(() => {
    const fetchUserProfile = async (_userId: undefined, accessToken: undefined, decodedToken: undefined) => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
          const userId = decodedToken.users_id;

          console.log(
            `Requesting URL: http://localhost:8080/api/users/${userId}`
          );

          const response = await fetch(
            `http://localhost:8080/api/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          console.log("API Response Status:", response.status);

          if (response.ok) {
            const data = await response.json();
            console.log("Profile Data:", data);

            // ตั้งค่า profile image path และข้อมูลอื่นๆ
            setUser({
              username: decodedToken.username,
              userType: data.role, // ตรวจสอบและอัปเดต userType จาก API response
              firstName: data.first_name,
              lastName: data.last_name,
              email: "", // Add the missing 'email' property
              userId: "", // Add the missing 'userId' property
              profilePictureUrl: data.user_image || "",
            });
          } else {
            console.error(
              `API Error: ${response.status} ${response.statusText}`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    // Remove the unnecessary function call with undefined arguments
    // fetchUserProfile(undefined, undefined, undefined);
  }, []);

  const altText = `${user.firstName || "User"} ${user.lastName || ""}`;
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
