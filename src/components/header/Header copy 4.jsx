"use client";

import { usePopover } from "@/hook/use-popover";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar"; // ใช้สำหรับโปรไฟล์

import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";

import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Bell as BellIcon } from "@phosphor-icons/react/dist/ssr/Bell";
import { List as ListIcon } from "@phosphor-icons/react/dist/ssr/List";
import { MagnifyingGlass as MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { Users as UsersIcon } from "@phosphor-icons/react/dist/ssr/Users";
import Link from "next/link";

import { useRouter } from "next/navigation"; // แก้ไขจาก next/navigation
import * as React from "react";
import { useEffect, useState } from "react";
import DrawerMobileNavigation from "../DrawerMobileNavigation";
// import { MobileNav } from "@/layout/MobileNav";
import { UserPopover } from "@/layout/user-popover";

// import jwtDecode from 'jwt-decode';
import { jwtDecode } from "jwt-decode";
// import { JwtPayload } from 'jsonwebtoken';
import { JwtPayload } from 'jwt-decode';

function Header() {
  const userPopover = usePopover();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: "",
    userType: "",
    firstName: "",
    lastName: "",
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

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      if (decoded && decoded.users_id) {
        setUser(prev => ({
          ...prev,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          userId: decoded.users_id  // สมมุติว่า token มี field users_id
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
    setUser({ firstName: "", lastName: "", profilePictureUrl: "" });
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
      setUsername(decodedToken.users_id); // สมมุติว่ามี username ใน token
    }
  }, []);

  // ประกาศฟังก์ชัน fetchUserProfile ก่อนใช้งานใน useEffect
  const fetchUserProfile = async (userId, accessToken, decodedToken) => {
    try {
      console.log(`Requesting URL: https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`);
      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`,
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
        setUser({
          username: decodedToken.username,
          userType: data.role, // ตรวจสอบและอัปเดต userType จาก API response
          firstName: data.first_name,
          lastName: data.last_name,
          profilePictureUrl: data.user_image || "",
        });
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
    const fetchUserProfile = async (userId, accessToken, decodedToken) => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
          const userId = decodedToken.users_id;

          console.log(
            `Requesting URL: https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`
          );

          const response = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${userId}`,
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

    fetchUserProfile();
  }, []);

  const altText = `${user.firstName || "User"} ${user.lastName || ""}`;

  return (
    <div className="font-bold w-full fixed top-0">
      <AppBar position="fixed" sx={{ zIndex: 1500, background: "#FFFFFF" }}>
        {" "}
        {/* ปรับค่า z-index ให้สูง */}
        {/* <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} sx={{ background: "#FFFFFF" }}> */}
        <Toolbar>
          {/* <IconButton
            size="medium"
            edge="start"
            color="black"
            aria-label="menu"
            onClick={handleDrawerOpen}
            sx={{ mr: 2 }}
          > */}
          <DrawerMobileNavigation handleDrawerOpen={handleDrawerOpen} />
          {/* </IconButton> */}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: "left", color: "black" }}
          >
            <Link href="/" passHref>
              DiceDreams
            </Link>
          </Typography>

          {username ? (
            <>
              {user.userType === "store" ? (
                <Button
                  variant="contained"
                  sx={{
                    background: "black",
                    color: "white",
                    marginRight: "10px",
                  }}
                  href="/post-activity"
                  replace="true"
                >
                  สร้างโพสต์กิจกรรม
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    background: "black",
                    color: "white",
                    marginRight: "10px",
                  }}
                  href="/post-play"
                  replace="true"
                >
                  สร้างโพสต์
                </Button>
              )}
              <Button
                variant="contained"
                sx={{
                  background: "darkred",
                  color: "white",
                  marginRight: "10px",
                }}
                onClick={handleLogout}
              >
                ออกจากระบบ
              </Button>
              <Avatar
                src={user.profilePictureUrl}
                alt={altText}
                onClick={userPopover.handleOpen}
                ref={userPopover.anchorRef}
              >
                {!user.profilePictureUrl &&
                  `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`}
              </Avatar>
              <UserPopover userId={user.userId} anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
            </>
          ) : (
            <>
              <Button
                variant="contained"
                sx={{ background: "gray", color: "white", marginRight: "10px" }}
                href="/sign-up"
                replace="true"
              >
                สมัครสมาชิก
              </Button>
              <Button
                variant="contained"
                sx={{ background: "red", color: "white", marginRight: "10px" }}
                href="/sign-in"
                replace="true"
              >
                เข้าสู่ระบบ
              </Button>
            </>
          )}
          {/* <CircleNotificationsIcon sx={{ color: "black", size: "15" }} /> */}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header;
