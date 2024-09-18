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
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
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
import Image from "next/image";

// import jwtDecode from 'jwt-decode';
import { jwtDecode } from "jwt-decode";
// import { JwtPayload } from 'jsonwebtoken';
import { JwtPayload } from "jwt-decode";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";

import { format, parseISO, compareDesc, isValid } from "date-fns";
import { th } from "date-fns/locale";
import axios from "axios";
import {
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const formatDateTime = (dateString) => {
  if (!dateString) return "Invalid date";
  const date = parseISO(dateString);
  if (isNaN(date)) return "Invalid date";
  const formattedDate = format(
    date,
    "วันEEEE ที่ d MMMM yyyy 'เวลา' HH:mm 'น.'",
    { locale: th }
  );
  return formattedDate;
};

const formatThaiDate = (dateString) => {
  if (!dateString) return "Invalid date";
  const date = parseISO(dateString);
  if (isNaN(date)) return "Invalid date";
  const formattedDate = format(date, "วันEEEE ที่ d MMMM yyyy", { locale: th });
  return formattedDate;
};

const formatThaiTime = (timeString) => {
  if (!timeString) return "Invalid time";
  const [hours, minutes] = timeString.split(":");
  if (!hours || !minutes) return "Invalid time";
  const formattedTime = `เวลา ${hours}.${minutes} น.`;
  return formattedTime;
};

const isPastDateTime = (date, time) => {
  const [hours, minutes] = time.split(":");
  const eventDate = new Date(date);
  eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
  return eventDate < new Date();
};

function PostGames() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isFullSize, setIsFullSize] = useState(false);
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [selectedPostId, setSelectedPostId] = useState(null);

  // เปิดเมนู Pop Up ตัวเลือก
  const handleMenuClick = (event, postId, post) => {
    console.log("Selected post: ", post); // ตรวจสอบค่าของโพสต์ที่ถูกเลือก
    if (!post) {
      console.error("โพสต์ไม่มีข้อมูล หรือเป็น undefined");
      setSnackbarMessage("ไม่พบข้อมูลของโพสต์นี้");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    setAnchorEl(event.currentTarget); // เปิดเมนูป๊อปอัป
    setSelectedPostId(postId); // บันทึก postId ของโพสต์ที่ถูกคลิก
    setSelectedPost(post); // ตั้งค่า selectedPost ให้ตรงกับโพสต์ที่ถูกเลือก
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

  // ฟังก์ชันสำหรับปิด Snackbar
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleImageClick = () => {
    setIsFullSize(!isFullSize);
  };

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setError("Access token is not available.");
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(accessToken);
        setUserId(decoded.users_id);

        const userResponse = await fetch(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/users/${decoded.users_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!userResponse.ok) throw new Error("Failed to fetch user details");
        const userData = await userResponse.json();

        const postsResponse = await fetch(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame/user/${decoded.users_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!postsResponse.ok) throw new Error("Failed to fetch posts");
        const postsData = await postsResponse.json();

        const participantsResponse = await fetch(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/participate`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!participantsResponse.ok)
          throw new Error("Failed to fetch participants");
        const participantsData = await participantsResponse.json();

        // กรองโพสต์ที่มีสถานะเป็น unActive
        const activePosts = postsData.filter(
          (post) => post.status_post !== "unActive"
        );

        const postsWithParticipants = activePosts.map((post) => {
          const postParticipants = participantsData.filter(
            (participant) => participant.post_games_id === post.post_games_id
          );
          return {
            ...post,
            participants: postParticipants.length + 1, // Adding 1 to the count of participants
            userFirstName: userData.first_name,
            userLastName: userData.last_name,
            userProfileImage: userData.user_image || "/images/default-user.png", // ตรวจสอบ userProfileImage
            creation_date: post.creation_date,
            formattedCreationDate: formatDateTime(post.creation_date),
            date_meet: post.date_meet,
            time_meet: post.time_meet,
            isPast: isPastDateTime(post.date_meet, post.time_meet),
          };
        });

        // เรียงลำดับโพสต์ตามวันที่สร้างโพสต์ และแยกโพสต์ที่เลยนัดเล่นไปแล้วไปด้านล่าง
        const sortedPosts = postsWithParticipants.sort((a, b) => {
          if (a.isPast && !b.isPast) return 1;
          if (!a.isPast && b.isPast) return -1;
          return compareDesc(
            new Date(a.creation_date),
            new Date(b.creation_date)
          );
        });

        setItems(sortedPosts);
      } catch (error) {
        setError("Failed to load data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, []);

  const handleButtonClick = (event, id) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

    router.push(`/PostGameDetail?id=${id}#chat`);
  };

  const handleLinkClick = async (event, postId) => {
    event.preventDefault();

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
      const userId = decoded.users_id; // ดึง users_id จาก token
      const userRole = decoded.role;

      // ตรวจสอบว่า role ของผู้ใช้เป็น "user" หรือไม่
      if (userRole !== "user") {
        setSnackbarMessage("คุณไม่มีสิทธิ์ในการแก้ไขโพสต์นี้");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      if (userId !== selectedPost.users_id) {
        setSnackbarMessage("คุณไม่ใช่เจ้าของโพสต์นี้");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }
      // ตรวจสอบว่า userId ตรงกับ users_id ของโพสต์ที่เลือกหรือไม่
      console.log("Current userId: ", userId); // ตรวจสอบ userId ของคุณ
      console.log("Selected post userId: ", selectedPost.users_id); // ตรวจสอบ users_id ของโพสต์

      // ถ้า userId ตรงกับ users_id ของโพสต์ ให้ทำการนำทางไปที่หน้าแก้ไขโพสต์
      setSelectedPostId(postId); // บันทึก postId ของโพสต์ที่ถูกคลิก
      router.push(`/PostPlayEdit?id=${postId}`);
    } catch (error) {
      setSnackbarMessage("Token ไม่ถูกต้องหรือหมดอายุ กรุณาเข้าสู่ระบบใหม่");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      router.push("/sign-in");
    }
  };

  // ยืนยันการลบโพสต์
  // ฟังก์ชันสำหรับเปลี่ยนสถานะโพสต์เป็น unActive
  const handleUpdateStatus = async () => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setSnackbarMessage("กรุณาเข้าสู่ระบบก่อน");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }

    try {
      const decoded = jwtDecode(accessToken);
      const userId = decoded.users_id;
      const userRole = decoded.role;

      console.log("Selected post: ", selectedPost); // ตรวจสอบค่าของ selectedPost ก่อนดำเนินการ
      if (!selectedPost) {
        setSnackbarMessage("ไม่พบข้อมูลของโพสต์นี้");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      if (userId !== selectedPost.users_id) {
        setSnackbarMessage("คุณไม่ใช่เจ้าของโพสต์นี้");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      // เรียก API PUT เพื่ออัปเดตสถานะโพสต์
      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame/${selectedPostId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status_post: "unActive", // อัปเดตสถานะโพสต์เป็น "unActive"
          }),
        }
      );

      if (!response.ok) {
        throw new Error("การอัปเดตสถานะโพสต์ล้มเหลว");
      }

      setSnackbarMessage("โพสต์กิจกรรมนี้ได้ถูกลบเป็นที่เรียบร้อยแล้ว");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      // อัปเดตสถานะของโพสต์ใน UI
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.post_games_id === selectedPostId
            ? { ...item, status_post: "unActive" }
            : item
        )
      );

      // รีเฟรชหน้าเว็บ
      window.location.reload();
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setDeleteOpen(false); // ปิด Dialog
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

  if (loading)
    return <Typography sx={{ color: "white" }}>กำลังโหลดโพสต์...</Typography>;
  if (error) return <Typography sx={{ color: "white" }}>{error}</Typography>;

  return (
    <div>
      {items.map((item) => (
        <Box
          key={item.id}
          sx={{
            borderColor: "grey.800",
            borderWidth: 1,
            borderStyle: "solid",
            borderRadius: 2,
            marginTop: 3,
            color: "white",
            padding: "16px",
            marginBottom: "16px",
            backgroundColor: "#121212",
            zIndex: 0,
          }}
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: "16px" }}
          >
            <Grid item>
              <Avatar
                alt={`${item.userFirstName} ${item.userLastName}`}
                src={item.userProfileImage}
                sx={{
                  borderRadius: "50%",
                  width: "50px",
                  height: "50px",
                  cursor: "pointer",
                  backgroundColor: item.userProfileImage
                    ? "transparent"
                    : "gray",
                  border: "2px solid white", // เพิ่มกรอบสีขาว
                  color: "white", // ตั้งค่าสีตัวอักษรเป็นสีขาว
                }}
              >
                {!item.userProfileImage &&
                  `${item.userFirstName?.[0] ?? ""}${item.userLastName?.[0] ?? ""}`}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "white" }}
              >
                {item.userFirstName} {item.userLastName}
              </Typography>
              <Typography variant="body2" sx={{ color: "white" }}>
                {item.formattedCreationDate}
              </Typography>
            </Grid>
            <Grid item>
              <div>
                {/* ปุ่มเปิด Pop Up ตัวเลือก */}
                <IconButton
                  sx={{ color: "white" }}
                  aria-label="settings"
                  onClick={(event) =>
                    handleMenuClick(event, item.post_games_id, item)
                  } // ส่ง item (ข้อมูลโพสต์) ไปด้วย
                >
                  <MoreVertOutlinedIcon />
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    onClick={(event) =>
                      handleLinkClick(event, selectedPostId, item.users_id)
                    }
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
                    <Button onClick={handleUpdateStatus} color="error">
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

          <div style={{ position: "relative" }}>
            <Image
              src={
                item.games_image
                  ? item.games_image
                  : "/images/default-image.png"
              }
              alt={item.name_games || "Default Image"}
              width={526}
              height={296}
              layout="responsive"
              style={{
                borderRadius: "0%",
                marginBottom: "16px",
              }}
            />
            {item.isPast && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.65)",
                  borderRadius: "50%",
                  width: "70%", // คงขนาดวงกลมเท่าเดิม
                  height: "70%", // คงขนาดวงกลมเท่าเดิม
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontSize: "2.5vw", // ใช้ vw เพื่อให้ขนาดยืดหยุ่นตามหน้าจอ
                  fontWeight: 600,
                  whiteSpace: "normal", // อนุญาตให้ข้อความแบ่งบรรทัดได้
                  wordBreak: "break-word", // ทำให้การตัดคำเกิดขึ้นที่ขอบคำ
                  maxWidth: "90%", // ให้ความกว้างของข้อความไม่เกินคอนเทนเนอร์
                  lineHeight: 1.2, // ปรับระยะห่างบรรทัดให้พอดี
                  textAlign: "center", // ทำให้ข้อความจัดชิดกลางในแนวตั้ง
                  padding: "10px", // เพิ่ม padding เพื่อไม่ให้ข้อความชนขอบ
                  zIndex: 20,
                }}
              >
                โพสต์นี้เลยนัดเล่นไปแล้ว
              </div>
            )}
          </div>

          <div className="text-left">
            <Typography sx={{ color: "white", fontWeight: "bold" }}>
              {item.name_games}
            </Typography>
            <Typography sx={{ color: "white" }}>
              วันที่เจอกัน: {formatThaiDate(item.date_meet)}
            </Typography>
            <Typography sx={{ color: "white" }}>
              เวลาที่เจอกัน: {formatThaiTime(item.time_meet)}
            </Typography>

            <br />
            <Typography sx={{ color: "white" }}>{item.detail_post}</Typography>

            <Typography sx={{ color: "white" }}>
              สถานที่ : 43/5 ถนนราชดำเนิน (ถนนต้นสน)
              ประตูองค์พระปฐมเจดีย์ฝั่งตลาดโต้รุ่ง
            </Typography>
            <Typography sx={{ color: "white" }}>
              จำนวนคนจะไป : {item.participants}/{item.num_people}
            </Typography>

            <br />

            <Grid container spacing={2} justifyContent="center">
              {item.users_id !== userId && !item.isPast && (
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<LoginIcon />}
                    sx={{
                      backgroundColor: "red",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "darkred",
                      },
                    }}
                  >
                    เข้าร่วม
                  </Button>
                </Grid>
              )}
              {!item.isPast && (
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<CommentIcon />}
                    sx={{
                      backgroundColor: "black",
                      color: "white",
                      border: "1px solid white",
                      "&:hover": {
                        backgroundColor: "#333333",
                      },
                      zIndex: 0,
                    }}
                    onClick={(event) =>
                      handleButtonClick(event, item.post_games_id)
                    }
                  >
                    พูดคุย
                  </Button>
                </Grid>
              )}
            </Grid>
          </div>
        </Box>
      ))}
      {items.length === 0 && (
        <Typography sx={{ color: "white" }}>
          ไม่พบโพสต์นัดเล่นที่คุณเคยโพสต์
        </Typography>
      )}
    </div>
  );
}

export default PostGames;
