"use client";

import {
  Container,
  Grid,
  Paper,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
  RadioGroup,
  Radio,
  Menu,
  MenuItem,
  Alert,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import Header from "../components/header/Header";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Filter from "../components/Filter";
import SearchIcon from "@mui/icons-material/Search";
import CommentIcon from "@mui/icons-material/Comment"; // สำหรับปุ่มพูดคุย
import LoginIcon from "@mui/icons-material/Login"; // สำหรับปุ่มเข้าสู่ระบบ
import * as React from "react";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsIcon from "@mui/icons-material/Directions";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import CustomizedMenus from "../components/CustomizedMenus";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jwt-decode";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import { StorePopover } from "./store-popover";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const formatDateTime = (dateString) => {
  const date = parseISO(dateString);
  const formattedDate = format(
    date,
    "วันEEEE ที่ d MMMM yyyy 'เวลา' HH:mm 'น.'",
    {
      locale: th,
    }
  );
  return formattedDate;
};

const formatThaiDate = (dateString) => {
  const date = parseISO(dateString);
  const formattedDate = format(date, "วันEEEE ที่ d MMMM yyyy", { locale: th });
  return formattedDate;
};

const formatThaiTime = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  const formattedTime = `เวลา ${hours}.${minutes} น.`;
  return formattedTime;
};

function PostActivity() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");
  const router = useRouter();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isFullSize, setIsFullSize] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // เปิดเมนู Pop Up ตัวเลือก
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // ปิดเมนู Pop Up ตัวเลือก
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // เปิด/ปิด Dialog สำหรับแก้ไข
  const handleEditOpen = () => {
    setEditOpen(true);
    setAnchorEl(null); // ปิดเมนูเมื่อเปิดการแก้ไข
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  // เปิด/ปิด Dialog สำหรับลบ
  const handleDeleteOpen = () => {
    setDeleteOpen(true);
    setAnchorEl(null); // ปิดเมนูเมื่อเปิดการลบ
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  // ยืนยันการลบโพสต์
  const handleDeleteConfirm = () => {
    // Logic สำหรับลบโพสต์
    setDeleteOpen(false);
    setSnackbarMessage("โพสต์ถูกลบเรียบร้อยแล้ว");
    setSnackbarSeverity("success");
    setOpenSnackbar(true);
  };

  // ปิด Snackbar
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  // useEffect(() => {
  //   const fetchUserAndPosts = async () => {
  //     setLoading(true);
  //     const accessToken = localStorage.getItem("access_token");

  //     try {
  //       if (accessToken) {
  //         try {
  //           const decoded = jwtDecode(accessToken);
  //           setUserId(decoded.users_id); // ดึง users_id ของผู้ใช้ที่ล็อกอิน
  //           const userRole = decoded.role; // ดึง role ของผู้ใช้จาก token ที่ถอดรหัส

  //           if (userRole !== "store") {
  //             // ให้สิทธิ์เฉพาะผู้ที่มี role เป็น store
  //             setSnackbarMessage("คุณไม่มีสิทธิ์ในการแก้ไขโพสต์นี้");
  //             setSnackbarSeverity("error");
  //             setOpenSnackbar(true);
  //             return;
  //           }

  //           // ถ้าเป็น role store จะดำเนินการ fetch ข้อมูลโพสต์ตามปกติ
  //           const postsResponse = await fetch(
  //             `https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity/search`,
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${accessToken}`,
  //                 "Content-Type": "application/json",
  //               },
  //             }
  //           );
  //           if (!postsResponse.ok) throw new Error("Failed to fetch posts");
  //           const postsData = await postsResponse.json();

  //           const storesResponse = await fetch(
  //             `https://dicedreams-backend-deploy-to-render.onrender.com/api/store`,
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${accessToken}`,
  //                 "Content-Type": "application/json",
  //               },
  //             }
  //           );
  //           if (!storesResponse.ok) throw new Error("Failed to fetch stores");
  //           const storesData = await storesResponse.json();

  //           const now = new Date();

  //           // ฟิลเตอร์โพสต์ที่เป็นของผู้ใช้นั้น ๆ
  //           const postsWithStores = postsData
  //             .filter((post) => post.status_post !== "unActive")
  //             .filter((post) => {
  //               const postDate = parseISO(post.date_activity);
  //               return postDate >= now && post.users_id === decoded.users_id; // โพสต์ต้องเป็นของผู้ใช้ที่ล็อกอิน
  //             })
  //             .map((post) => {
  //               const postStore = storesData.find(
  //                 (store) => store.store_id === post.store_id
  //               );

  //               const rawCreationDate = parseISO(post.creation_date);
  //               if (isNaN(rawCreationDate)) {
  //                 console.error("Invalid date format:", post.creation_date);
  //               }

  //               return {
  //                 ...post,
  //                 userFirstName: postStore ? postStore.name_store : "Unknown",
  //                 userProfileImage: postStore
  //                   ? postStore.store_image
  //                   : "/images/default-profile.png",
  //                 rawCreationDate: rawCreationDate,
  //                 creation_date: formatDateTime(post.creation_date),
  //                 date_activity: formatThaiDate(post.date_activity),
  //                 time_activity: formatThaiTime(post.time_activity),
  //               };
  //             });

  //           const sortedPosts = postsWithStores.sort(
  //             (a, b) => b.rawCreationDate - a.rawCreationDate
  //           );

  //           setItems(sortedPosts);
  //         } catch (error) {
  //           setSnackbarMessage(
  //             "Token ไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่"
  //           );
  //           setSnackbarSeverity("error");
  //           setOpenSnackbar(true);
  //           return;
  //         }
  //       } else {
  //         setSnackbarMessage("กรุณาเข้าสู่ระบบก่อน");
  //         setSnackbarSeverity("error");
  //         setOpenSnackbar(true);
  //         router.push("/sign-in");
  //       }
  //     } catch (error) {
  //       setError("Failed to load data: " + error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchUserAndPosts();
  // }, []);

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem("access_token");

      try {
        if (accessToken) {
          const decoded = jwtDecode(accessToken);
          setUserId(decoded.users_id);

          const postsResponse = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity/search`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!postsResponse.ok) throw new Error("Failed to fetch posts");
          const postsData = await postsResponse.json();

          const storesResponse = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/store`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!storesResponse.ok) throw new Error("Failed to fetch stores");
          const storesData = await storesResponse.json();

          const now = new Date();

          const postsWithStores = postsData
            .filter((post) => post.status_post !== "unActive")
            .filter((post) => {
              const postDate = parseISO(post.date_activity);
              return postDate >= now;
            })
            .map((post) => {
              const postStore = storesData.find(
                (store) => store.store_id === post.store_id
              );

              const rawCreationDate = parseISO(post.creation_date);
              if (isNaN(rawCreationDate)) {
                console.error("Invalid date format:", post.creation_date);
              }

              return {
                ...post,
                userFirstName: postStore ? postStore.name_store : "Unknown",
                userProfileImage: postStore
                  ? postStore.store_image
                  : "/images/default-profile.png",
                rawCreationDate: rawCreationDate,
                creation_date: formatDateTime(post.creation_date),
                date_activity: formatThaiDate(post.date_activity),
                time_activity: formatThaiTime(post.time_activity),
                // users_id: post.users_id || "Unknown", // เพิ่มการตรวจสอบ users_id
              };
            });

          const sortedPosts = postsWithStores.sort(
            (a, b) => b.rawCreationDate - a.rawCreationDate
          );

          setItems(sortedPosts);
        } else {
          const postsResponse = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity/search` // ดึงโพสต์ทั้งหมดโดยไม่ต้องใช้ accessToken
          );
          if (!postsResponse.ok) throw new Error("Failed to fetch posts");
          const postsData = await postsResponse.json();

          const storesResponse = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/store`
          );
          if (!storesResponse.ok) throw new Error("Failed to fetch stores");
          const storesData = await storesResponse.json();

          const now = new Date();

          const postsWithStores = postsData
            .filter((post) => post.status_post !== "unActive")
            .filter((post) => {
              const postDate = parseISO(post.date_activity);
              return postDate >= now;
            })
            .map((post) => {
              const postStore = storesData.find(
                (store) => store.store_id === post.store_id
              );

              const rawCreationDate = parseISO(post.creation_date);
              if (isNaN(rawCreationDate)) {
                console.error("Invalid date format:", post.creation_date);
              }

              return {
                ...post,
                userFirstName: postStore ? postStore.name_store : "Unknown",
                userProfileImage: postStore
                  ? postStore.store_image
                  : "/images/default-profile.png",
                rawCreationDate: rawCreationDate,
                creation_date: formatDateTime(post.creation_date),
                date_activity: formatThaiDate(post.date_activity),
                time_activity: formatThaiTime(post.time_activity),
                // users_id: post.users_id || "Unknown", // เพิ่มการตรวจสอบ users_id
              };
            });

          const sortedPosts = postsWithStores.sort(
            (a, b) => b.rawCreationDate - a.rawCreationDate
          );

          setItems(sortedPosts);
        }
      } catch (error) {
        setError("Failed to load data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, []);

  if (loading)
    return <Typography sx={{ color: "white" }}>กำลังโหลดโพสต์...</Typography>;
  if (error) return <Typography sx={{ color: "white" }}>{error}</Typography>;

  const handleProfileClick = (userId) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

    router.push(`/profile/${userId}`);
  };

  const handleLinkClick = async (event, postId, postOwnerId) => {
    event.preventDefault();
    console.log("handleLinkClick is triggered"); // ตรวจสอบว่าโค้ดถูกเรียกใช้

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setSnackbarMessage("กรุณาเข้าสู่ระบบก่อน");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

    try {
      const decoded = jwtDecode(accessToken); // ถอดรหัส token เพื่อดึงข้อมูลผู้ใช้
      const userId = decoded.users_id;
      const userRole = decoded.role;

      // ตรวจสอบว่า role ของผู้ใช้เป็น store หรือไม่
      if (userRole !== "store") {
        console.log("Role is not store"); // ตรวจสอบว่า role ไม่ถูกต้อง
        setSnackbarMessage("คุณไม่มีสิทธิ์ในการแก้ไขโพสต์นี้");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      // ตรวจสอบว่า userId ตรงกับเจ้าของโพสต์หรือไม่
      // console.log("userId from token:", userId);
      // console.log("postOwnerId from post:", postOwnerId);
      // if (userId !== postOwnerId) {
      //   console.log("User ID does not match post owner ID");
      //   setSnackbarMessage("คุณไม่ใช่เจ้าของโพสต์นี้");
      //   setSnackbarSeverity("error");
      //   setOpenSnackbar(true);
      //   return;
      // }

      console.log("userId:", userId);
      console.log("postOwnerId:", postOwnerId);
      console.log("postId:", postId);
      console.log("userRole:", userRole);

      // ถ้าเป็นเจ้าของโพสต์และ role เป็น store จะพาไปที่หน้าแก้ไขโพสต์
      router.push(`/PostActivityEdit?id=${postId}`);
    } catch (error) {
      console.error("Error decoding token:", error); // ตรวจสอบข้อผิดพลาดการถอดรหัส token
      setSnackbarMessage("Token ไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      router.push("/sign-in");
    }
  };

  const checkToken = (token) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      if (decoded.exp && decoded.exp < now) {
        return false; // token หมดอายุ
      }
      return decoded; // return decoded token หากยังไม่หมดอายุ
    } catch (error) {
      return false; // token ผิดพลาด
    }
  };

  // const handleLinkClick = async (event, postId, postOwnerId) => {
  //   event.preventDefault();
  //   const accessToken = localStorage.getItem("access_token");
  //   const decoded = checkToken(accessToken);

  //   if (!decoded) {
  //     setSnackbarMessage("กรุณาเข้าสู่ระบบก่อน");
  //     setSnackbarSeverity("error");
  //     setOpenSnackbar(true);
  //     setTimeout(() => {
  //       router.push("/sign-in");
  //     }, 2000);
  //     return;
  //   }

  //   const userId = decoded.users_id;
  //   const userRole = decoded.role;

  //   if (userRole !== "store") {
  //     setSnackbarMessage("คุณไม่มีสิทธิ์ในการแก้ไขโพสต์นี้");
  //     setSnackbarSeverity("error");
  //     setOpenSnackbar(true);
  //     return;
  //   }

  //   if (userId !== postOwnerId) {
  //     setSnackbarMessage("คุณไม่ใช่เจ้าของโพสต์นี้");
  //     setSnackbarSeverity("error");
  //     setOpenSnackbar(true);
  //     return;
  //   }

  //   router.push(`/PostActivityEdit?id=${postId}`);
  // };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      {items.map((item) => (
        <Box
          key={item.post_activity_id}
          sx={{
            borderColor: "grey.800",
            borderWidth: 1,
            borderStyle: "solid",
            borderRadius: 2,
            marginTop: 3,
            color: "white",
            padding: "16px",
            marginBottom: "16px",
            backgroundColor: "#424242",
          }}
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: "16px" }}
          >
            <Grid item>
              <div onClick={() => handleProfileClick(item.store_id)}>
                <Grid item>
                  <div onClick={() => handleProfileClick(item.store_id)}>
                    <Avatar
                      sx={{
                        borderRadius: "50%",
                        width: "50px",
                        height: "50px",
                        cursor: "pointer",
                        border: "2px solid white", // เพิ่มกรอบสีขาว
                        overflow: "hidden", // เพื่อให้รูปภาพถูกครอบภายในวงกลม
                      }}
                    >
                      <Image
                        src={item.userProfileImage}
                        alt={`${item.userFirstName}`}
                        width={50}
                        height={50}
                        layout="fixed"
                        objectFit="cover" // เพื่อให้รูปภาพถูกครอบอย่างสม่ำเสมอภายใน Avatar
                      />
                    </Avatar>
                  </div>
                </Grid>
              </div>
            </Grid>
            <Grid item xs>
              <Typography
                variant="subtitle1"
                gutterBottom
                onClick={() => handleProfileClick(item.store_id)}
                style={{ cursor: "pointer" }} // เพิ่ม cursor: pointer
              >
                {item.userFirstName}
              </Typography>
              <Typography variant="body2" sx={{ color: "white" }}>
                {item.creation_date}
              </Typography>
            </Grid>
            <Grid item>
              <div>
                {/* ปุ่มเปิด Pop Up ตัวเลือก */}
                <IconButton
                  sx={{ color: "white" }}
                  aria-label="settings"
                  onClick={handleMenuClick}
                >
                  <MoreVertOutlinedIcon />
                </IconButton>

                {/* เมนูตัวเลือกสำหรับแก้ไขหรือลบ */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    onClick={(event) =>
                      handleLinkClick(
                        event,
                        item.post_activity_id,
                        item.users_id
                      )
                    } // เรียกใช้ฟังก์ชัน handleLinkClick
                  >
                    <EditIcon sx={{ marginRight: 1 }} />
                    แก้ไขโพสต์กิจกรรม
                  </MenuItem>

                  <MenuItem onClick={handleDeleteOpen}>
                    <DeleteIcon sx={{ marginRight: 1 }} />
                    ลบโพสต์กิจกรรม
                  </MenuItem>
                </Menu>

                {/* Dialog สำหรับแก้ไขโพสต์ */}
                {/* <Dialog open={editOpen} onClose={handleEditClose}>
                  <DialogTitle>แก้ไขโพสต์กิจกรรม</DialogTitle>
                  <DialogActions>
                    <Button onClick={handleEditClose} color="primary">
                      ยกเลิก
                    </Button>
                    <Button onClick={handleEditClose} color="primary">
                      บันทึกการแก้ไข
                    </Button>
                  </DialogActions>
                </Dialog> */}

                {/* Dialog ยืนยันการลบโพสต์ */}
                <Dialog open={deleteOpen} onClose={handleDeleteClose}>
                  <DialogTitle>คุณต้องการลบโพสต์นี้ใช่ไหม?</DialogTitle>
                  <DialogActions>
                    <Button onClick={handleDeleteClose} color="primary">
                      ยกเลิก
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="error">
                      ลบโพสต์
                    </Button>
                  </DialogActions>
                </Dialog>

                {/* Snackbar สำหรับแสดงข้อความ */}
                <Snackbar
                  open={openSnackbar}
                  autoHideDuration={6000}
                  onClose={handleSnackbarClose}
                >
                  <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: "100%" }}
                  >
                    {snackbarMessage}
                  </Alert>
                </Snackbar>
              </div>
              {/* <StorePopover
                userId={user.userId}
                anchorEl={userPopover.anchorRef.current}
                onClose={userPopover.handleClose}
                open={userPopover.open}
              /> */}
            </Grid>
          </Grid>

          <Image
            src={item.post_activity_image}
            alt={item.name_activity}
            width={526} // กำหนดขนาดที่เหมาะสม
            height={296}
            layout="responsive"
            sx={{ borderRadius: 1, marginBottom: 2 }} // เพิ่มระยะห่างด้านล่าง
          />

          <br />

          <Typography variant="h6" component="h3" gutterBottom>
            {item.name_activity}
          </Typography>
          <Typography variant="body1" gutterBottom>
            วันที่กิจกรรมสิ้นสุด: {item.date_activity}
          </Typography>
          <Typography variant="body1" gutterBottom>
            เวลาที่กิจกรรมสิ้นสุด: {item.time_activity}
          </Typography>

          <br />

          <Typography variant="body1" gutterBottom>
            {item.detail_post}
          </Typography>
          <Typography variant="body1" gutterBottom>
            สถานที่: 43/5 ถนนราชดำเนิน (ถนนต้นสน)
            ประตูองค์พระปฐมเจดีย์ฝั่งตลาดโต้รุ่ง
          </Typography>
        </Box>
      ))}
      {items.length === 0 && <Typography sx={{ color: "white" }}></Typography>}
      {/* <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          onClose={handleCloseSnackbar}
          severity="warning"
          sx={{ width: "100%" }}
        >
          กรุณาเข้าสู่ระบบก่อน
        </MuiAlert>
      </Snackbar> */}
      {errorMessage && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setErrorMessage("")}
        >
          <MuiAlert
            onClose={() => setErrorMessage("")}
            severity="error"
            sx={{ width: "100%" }}
          >
            {errorMessage}
          </MuiAlert>
        </Snackbar>
      )}
      {successMessage && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={handleCloseSuccessSnackbar}
        >
          <MuiAlert
            onClose={handleCloseSuccessSnackbar}
            severity="success"
            sx={{ width: "100%" }}
          >
            {successMessage}
          </MuiAlert>
        </Snackbar>
      )}
    </div>
  );
}

export default PostActivity;
