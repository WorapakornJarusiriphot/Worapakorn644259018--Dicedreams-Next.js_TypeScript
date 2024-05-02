"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import DrawerMobileNavigation from "../DrawerMobileNavigation";
import Link from "next/link";
import Avatar from "@mui/material/Avatar"; // ใช้สำหรับโปรไฟล์
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // แก้ไขจาก next/navigation

function Header() {
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

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    profilePictureUrl: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = localStorage.getItem("access_token");
        if (accessToken) {
          // แก้ไข userID ที่เหมาะสมเพื่อเรียก API
          const userId = "YOUR_USER_ID";
          const response = await fetch(`/api/user/${userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser({
              firstName: data.first_name,
              lastName: data.last_name,
              profilePictureUrl: data.user_image || "",
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // ใช้ชื่อจริงและนามสกุลหากมี ไม่ใช่ undefinedundefined
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
              {/* แสดงรูปโปรไฟล์เมื่อเข้าสู่ระบบแล้ว */}
              <Button
                variant="contained"
                sx={{
                  background: "black",
                  color: "white",
                  marginRight: "10px",
                }}
                href="/create-post"
                replace="true"
              >
                สร้างโพสต์
              </Button>
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
                alt={
                  user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : "User Avatar"
                }
                sx={{ marginRight: "10px" }}
              >
                {!user.profilePictureUrl &&
                  `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`}
              </Avatar>
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
