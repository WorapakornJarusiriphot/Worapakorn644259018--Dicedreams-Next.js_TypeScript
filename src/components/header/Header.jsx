"use client";

import { usePopover } from "@/hook/use-popover";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
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
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
import DrawerMobileNavigation from "../DrawerMobileNavigation";
import { UserPopover } from "@/layout/user-popover";
import { jwtDecode } from "jwt-decode";
import Modal from "@mui/material/Modal";
import { JwtPayload } from "jwt-decode";
import NotificationsPopover from "@/layout/dashboard/common/notifications-popover";
import { useMediaQuery, useTheme } from "@mui/material";

const DiceDreamsUrl =
  "https://github.com/WorapakornJarusiriphot/Worapakorn644259018--Dicedreams-Next.js_TypeScript/blob/main/src/app/icon.png?raw=true";

function Header() {
  const userPopover = usePopover();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    userType: "",
    firstName: "",
    lastName: "",
    profilePictureUrl: "",
    userId: "",
  });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // ตรวจสอบว่าหน้าจอเป็นขนาดมือถือหรือไม่
  const isSmallMobile = useMediaQuery("(max-width:360px)"); // ตรวจสอบหน้าจอที่เล็กกว่า 360px

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      if (decoded && decoded.users_id) {
        setUser((prev) => ({
          ...prev,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          userId: decoded.users_id,
        }));
      }
    }
  }, []);

  const [openNav, setOpenNav] = useState(false);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  // ประกาศฟังก์ชัน fetchNotifications สำหรับการดึงข้อมูลการแจ้งเตือน
  const fetchNotifications = async (userId, accessToken) => {
    try {
      console.log(
        `Requesting URL: https://dicedreams-backend-deploy-to-render.onrender.com/api/notifications/${userId}`
      );
      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/notifications/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Notifications Data:", data);
        setNotifications(data.notifications || []); // อัปเดตสถานะการแจ้งเตือน
      } else {
        console.error(`API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      const now = Math.floor(Date.now() / 1000);
      if (decoded && decoded.exp > now) {
        setUser((prev) => ({
          ...prev,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          userId: decoded.users_id,
        }));

        fetchUserProfile(decoded.users_id, accessToken, decoded);

        // Start polling notifications
        const interval = setInterval(() => {
          fetchNotifications(decoded.users_id, accessToken);
        }, 5000); // Fetch every 5 seconds

        // Clear interval on component unmount
        return () => clearInterval(interval);
      } else {
        setModalOpen(true);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token"); // ล้าง token ที่เก็บไว้
    setUserLoggedIn(false); // อัปเดต state
    setUser({ firstName: "", lastName: "", profilePictureUrl: "" });
    router.push("/sign-in"); // เปลี่ยนเส้นทางไปยังหน้าล็อกอิน
  };

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

  const [modalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
    router.push("/sign-in");
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      const now = Math.floor(Date.now() / 1000);
      if (decoded && decoded.exp > now) {
        setUser((prev) => ({
          ...prev,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          email: decoded.email,
          userId: decoded.users_id,
        }));
      } else {
        setModalOpen(true);
      }
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");

    if (accessToken) {
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
      setUsername(decodedToken.users_id);
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken) {
      const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
      const userId = decodedToken.users_id;
      fetchUserProfile(userId, accessToken, decodedToken);
    }
  }, []);

  return (
    <div className="header-wrapper">
      <AppBar position="fixed" sx={{ zIndex: 1300, background: "#FFFFFF" }}>
        <Toolbar>
          <DrawerMobileNavigation
            handleDrawerOpen={handleDrawerOpen}
            id="DrawerMobileNavigation"
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: "left", color: "black" }}
            id="Home-page"
          >
            <Link href="/" passHref>
              <Avatar src={DiceDreamsUrl} alt="DiceDreams" id="Home-page" />
            </Link>
          </Typography>

          {username ? (
            <>
              <Stack
                direction="row"
                spacing={isMobile ? 1 : 2}
                alignItems="center"
              >
                {user.userType === "store" ? (
                  <Button
                    variant="contained"
                    id="Create-PostActivity"
                    sx={{
                      background: "black",
                      color: "white",
                      fontSize: isSmallMobile
                        ? "10px"
                        : isMobile
                          ? "12px"
                          : "16px", // ขนาดตัวอักษรให้เท่ากับปุ่ม "ออกจากระบบ"
                      padding: isSmallMobile ? "4px 6px" : "6px 12px", // ปรับ padding ให้เหมาะสมตามขนาดหน้าจอ
                      minWidth: isSmallMobile ? "auto" : "100px", // ขนาดขั้นต่ำของปุ่ม
                      maxWidth: "200px", // กำหนดขนาดความกว้างสูงสุดของปุ่ม
                      whiteSpace: "nowrap", // ป้องกันการตัดคำ
                      overflow: "hidden",
                      textOverflow: "ellipsis", // แสดงข้อความเป็น ... หากข้อความยาวเกินไป
                    }}
                    href="/post-activity"
                    replace="true"
                  >
                    โพสต์กิจกรรม
                  </Button>
                ) : user.userType === "admin" ? (
                  <Button
                    variant="contained"
                    id="Manage-Users"
                    sx={{
                      background: "black",
                      color: "white",
                      fontSize: isSmallMobile
                        ? "10px"
                        : isMobile
                          ? "12px"
                          : "16px",
                      padding: isSmallMobile ? "4px 6px" : "6px 12px",
                      minWidth: isSmallMobile ? "auto" : "100px",
                    }}
                    href="/Admin"
                    replace="true"
                  >
                    จัดการผู้ใช้
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    id="Create-PostGames"
                    sx={{
                      background: "black",
                      color: "white",
                      fontSize: isSmallMobile
                        ? "10px"
                        : isMobile
                          ? "12px"
                          : "16px",
                      padding: isSmallMobile ? "4px 6px" : "6px 12px",
                      minWidth: isSmallMobile ? "auto" : "100px",
                    }}
                    href="/post-play"
                    replace="true"
                  >
                    สร้างโพสต์
                  </Button>
                )}
                <Button
                  variant="contained"
                  id="Sign-Out"
                  sx={{
                    background: "darkred",
                    color: "white",
                    fontSize: isSmallMobile
                      ? "10px"
                      : isMobile
                        ? "12px"
                        : "16px",
                    padding: isSmallMobile ? "4px 6px" : "6px 12px",
                    minWidth: isSmallMobile ? "auto" : "100px",
                  }}
                  onClick={handleLogout}
                >
                  ออกจากระบบ
                </Button>
              </Stack>
              <Box sx={{ zIndex: 1400 }}>
                <NotificationsPopover />
              </Box>
              <Tooltip title="บัญชี">
                <Box sx={{ zIndex: 1400 }}>
                  <Avatar
                    src={user.profilePictureUrl}
                    id="account"
                    alt={altText}
                    onClick={userPopover.handleOpen}
                    ref={userPopover.anchorRef}
                    sx={{
                      marginLeft: "10px",
                    }}
                  >
                    {!user.profilePictureUrl &&
                      `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`}
                  </Avatar>
                </Box>
              </Tooltip>
              <UserPopover
                userId={user.userId}
                anchorEl={userPopover.anchorRef.current}
                onClose={userPopover.handleClose}
                open={userPopover.open}
              />
            </>
          ) : (
            <>
              <Button
                variant="contained"
                id="sign-up"
                sx={{ background: "gray", color: "white", marginRight: "10px" }}
                href="/sign-up"
                replace="true"
              >
                สมัครสมาชิก
              </Button>
              <Button
                variant="contained"
                id="sign-in"
                sx={{ background: "red", color: "white", marginRight: "10px" }}
                href="/sign-in"
                replace="true"
              >
                เข้าสู่ระบบ
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        id="CircleNotificationsIcon"
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            boxShadow: 24,
            borderRadius: 4,
            width: "90%",
            maxWidth: 500,
            p: 4,
            textAlign: "center",
            position: "relative",
          }}
          id="CircleNotificationsIcon"
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: "50%",
              width: 80,
              height: 80,
              mx: "auto",
            }}
            id="CircleNotificationsIcon"
          >
            <CircleNotificationsIcon sx={{ fontSize: 40, color: "#d32f2f" }} />
          </Box>
          <Typography
            id="modal-title"
            variant="h5"
            component="h2"
            sx={{ mb: 2, fontWeight: 600, color: "#333" }}
          >
            กรุณาเข้าสู่ระบบใหม่
          </Typography>
          <Typography id="modal-description" sx={{ mb: 3, color: "#555" }}>
            เพื่อความปลอดภัย คุณต้องเข้าสู่ระบบใหม่เพื่อเข้าถึงการใช้งาน
          </Typography>
          <Button
            variant="contained"
            onClick={handleModalClose}
            id="Go-login"
            sx={{
              backgroundColor: "#4285f4",
              color: "#fff",
              px: 4,
              py: 1,
              fontWeight: "bold",
              textTransform: "none",
              borderRadius: 4,
              "&:hover": {
                backgroundColor: "#357ae8",
              },
            }}
          >
            ไปที่หน้าเข้าสู่ระบบ
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default Header;
