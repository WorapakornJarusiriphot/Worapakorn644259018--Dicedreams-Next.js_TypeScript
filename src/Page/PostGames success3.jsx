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
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jwt-decode";
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { Link } from 'react-router-dom';
import Link from "next/link";
import Avatar from "@mui/material/Avatar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// สร้าง custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#00C853", // สีเขียวสดใสสำหรับปุ่ม "เข้าร่วม"
    },
    error: {
      main: "#D32F2F", // สีแดงสำหรับปุ่ม "ยกเลิก"
    },
  },
});

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
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const postsResponse = await fetch(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/postGame`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!postsResponse.ok) throw new Error("Failed to fetch posts");
        const postsData = await postsResponse.json();

        const usersResponse = await fetch(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/users`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const usersData = await usersResponse.json();

        const participantsResponse = await fetch(
          `https://dicedreams-backend-deploy-to-render.onrender.com/api/participate`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!participantsResponse.ok)
          throw new Error("Failed to fetch participants");
        const participantsData = await participantsResponse.json();

        const accessToken = localStorage.getItem("access_token");
        let currentUserId = "";
        if (accessToken) {
          try {
            const decoded = jwtDecode(accessToken);
            currentUserId = decoded.users_id;
            setUserId(currentUserId);
          } catch (error) {
            setError("Invalid access token.");
          }
        }

        const postsWithParticipants = postsData.map((post) => {
          const postParticipants = participantsData.filter(
            (participant) =>
              participant.post_games_id === post.post_games_id &&
              ["active", "unActive", "pending"].includes(
                participant.participant_status
              ) // ตรวจสอบสถานะ active, unActive, หรือ pending
          );

          const postUser = usersData.find(
            (user) => user.users_id === post.users_id
          );

          const isParticipated = participantsData.some(
            (participant) =>
              participant.user_id === currentUserId &&
              participant.post_games_id === post.post_games_id &&
              ["active", "unActive", "pending"].includes(
                participant.participant_status
              ) // ตรวจสอบสถานะ active, unActive, หรือ pending
          );

          return {
            ...post,
            participants: postParticipants.length + 1,
            userFirstName: postUser ? postUser.first_name : "Unknown",
            userLastName: postUser ? postUser.last_name : "Unknown",
            userProfileImage: postUser
              ? postUser.user_image
              : "default-image-url",
            rawCreationDate: post.creation_date,
            creation_date: formatDateTime(post.creation_date),
            date_meet: post.date_meet,
            time_meet: post.time_meet,
            isParticipated: isParticipated, // กำหนดค่าการเข้าร่วมให้ถูกต้อง
          };
        });

        const currentTime = new Date();
        const filteredPosts = postsWithParticipants.filter((post) => {
          const postDateTime = new Date(`${post.date_meet}T${post.time_meet}`);
          const isPostFull = post.participants >= post.num_people; // ตรวจสอบว่าคนเต็มหรือไม่
          return postDateTime > currentTime && !isPostFull; // แสดงเฉพาะโพสต์ที่ยังไม่เต็มและยังไม่หมดเวลา
        });

        const sortedPosts = filteredPosts.sort(
          (a, b) => new Date(b.rawCreationDate) - new Date(a.rawCreationDate)
        );

        setItems(sortedPosts);
      } catch (error) {
        setError("Failed to load data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleJoinClick = (post) => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

    setSelectedPost(post);
    setOpenDialog(true);
  };

  const handleConfirmJoin = async () => {
    setOpenDialog(false);
    if (selectedPost) {
      try {
        const accessToken = localStorage.getItem("access_token");
        const response = await axios.post(
          "https://dicedreams-backend-deploy-to-render.onrender.com/api/participate",
          {
            participant_status: "active",
            participant_apply_datetime: new Date().toLocaleString("th-TH"),
            user_id: userId,
            post_games_id: selectedPost.post_games_id,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.status === 201) {
          setSuccessMessage("คุณได้ทำการเข้าร่วมโพสต์นัดเล่นสำเร็จแล้ว");
          setItems((prevItems) =>
            prevItems.map((item) =>
              item.post_games_id === selectedPost.post_games_id
                ? { ...item, isParticipated: true }
                : item
            )
          );
        } else if (response.status === 400) {
          setErrorMessage("คุณได้ถูกเตะออกจากการโพสต์นัดเล่นนี้แล้ว");
        } else {
          setErrorMessage(
            "Failed to join the post with status: " + response.status
          );
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setErrorMessage("คุณได้ถูกเตะออกจากการโพสต์นัดเล่นนี้แล้ว");
        } else {
          setErrorMessage("Error joining the post: " + error.message);
        }
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

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

  const handleLinkClick2 = (event, id) => {
    event.preventDefault();
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setOpenSnackbar(true);
      setTimeout(() => {
        router.push("/sign-in");
      }, 2000);
      return;
    }

    router.push(`/PostGameDetail?id=${id}`);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleCloseSuccessSnackbar = () => {
    setSuccessMessage("");
  };

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

      setSnackbarMessage("โพสต์นัดเล่นนี้ได้ถูกลบเป็นที่เรียบร้อยแล้ว");
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
          key={item.post_games_id}
          sx={{
            borderColor: "grey.800",
            borderWidth: 1,
            borderStyle: "solid",
            borderRadius: 2,
            marginTop: 3,
            color: "white",
            padding: "16px",
            marginBottom: "16px",
            backgroundColor: "#121212", // Added to match the Figma background
            zIndex: 0, // กำหนดค่า z-index เพื่อให้การ์ดอยู่เหนือ navbar
          }}
        >
          <Grid
            container
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: "16px" }}
          >
            <Grid item>
              <div onClick={() => handleProfileClick(item.users_id)}>
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
                  }}
                >
                  {!item.userProfileImage &&
                    `${item.userFirstName?.[0] ?? ""}${item.userLastName?.[0] ?? ""}`}
                </Avatar>
              </div>
            </Grid>
            <Grid item xs>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ color: "white", cursor: "pointer" }} // เพิ่ม cursor: pointer
                onClick={() => handleProfileClick(item.users_id)}
              >
                {item.userFirstName} {item.userLastName}
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
                  id="MoreVertOutlinedIcon"
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
                    id="Edit-PostGames"
                  >
                    <EditIcon sx={{ marginRight: 1 }} />
                    แก้ไขโพสต์นัดเล่น
                  </MenuItem>
                  <MenuItem onClick={handleDeleteOpen} id="Delete-PostGames">
                    <DeleteIcon sx={{ marginRight: 1 }} />
                    ลบโพสต์นัดเล่น
                  </MenuItem>
                </Menu>

                {/* Dialog สำหรับแก้ไขโพสต์ */}
                {/* <Dialog open={editOpen} onClose={handleEditClose}>
                  <DialogTitle>แก้ไขโพสต์นัดเล่น</DialogTitle>
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
                    <Button onClick={handleDeleteClose} id="cancel" color="primary">
                      ยกเลิก
                    </Button>
                    <Button onClick={handleUpdateStatus} id="Delete-Post" color="error">
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

          <a
            href={{
              pathname: "/PostGameDetail",
              query: { id: item?.post_games_id },
            }}
            onClick={(event) => handleLinkClick2(event, item.post_games_id)}
          >
            <div
              style={{
                width: "100%",
                paddingBottom: "56.25%", // 16:9 aspect ratio
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={handleImageClick}
            >
              <img
                src={item.games_image}
                alt={item.name_games}
                layout="fill"
                objectFit="cover"
                style={{
                  transition: "transform 0.3s ease",
                  transform: isFullSize ? "scale(1)" : "scale(1)",
                }}
              />
            </div>

            <br />

            <div className="text-left">
              <Typography
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {item.name_games}
              </Typography>
              <Typography
                sx={{
                  color: "white",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                วันที่เจอกัน: {formatThaiDate(item.date_meet)}
              </Typography>
              <Typography
                sx={{
                  color: "white",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                เวลาที่เจอกัน: {formatThaiTime(item.time_meet)}
              </Typography>
              <br />
              <Typography
                sx={{
                  color: "white",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                {item.detail_post}
              </Typography>

              <Typography
                sx={{
                  color: "white",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                สถานที่ : 43/5 ถนนราชดำเนิน (ถนนต้นสน)
                ประตูองค์พระปฐมเจดีย์ฝั่งตลาดโต้รุ่ง
              </Typography>
              <Typography
                sx={{
                  color: "white",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                จำนวนคนจะไป : {item.participants}/{item.num_people}
              </Typography>
              <br />
            </div>
          </a>

          <Grid container spacing={2} justifyContent="center">
            {item.users_id !== userId &&
              !item.isParticipated &&
              !["unActive", "pending"].includes(item.participant_status) && (
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
                    onClick={() => handleJoinClick(item)}
                    id="participate"
                  >
                    เข้าร่วม
                  </Button>
                </Grid>
              )}

            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                fullWidth
                startIcon={<CommentIcon />}
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  border: "1px solid white",
                  "&:hover": { backgroundColor: "#333333" },
                  zIndex: 0,
                }}
                onClick={(event) =>
                  handleButtonClick(event, item.post_games_id)
                }
                id="chat"
              >
                พูดคุย
              </Button>
            </Grid>
          </Grid>
        </Box>
      ))}
      {items.length === 0 && (
        <Typography sx={{ color: "white" }}>
          ไม่พบโพสต์นัดเล่นเลยตอนนี้
        </Typography>
      )}
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
            {errorMessage === "Request failed with status code 400"
              ? "คุณได้ถูกเตะออกจากการโพสต์นัดเล่นนี้แล้ว"
              : errorMessage}
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
      <ThemeProvider theme={theme}>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>ยืนยันการเข้าร่วม</DialogTitle>
          <DialogContent>
            <DialogContentText>
              คุณแน่ใจนะว่าจะเข้าร่วมโพสต์นัดเล่นโพสต์นี้?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} id="cancel" color="error">
              ยกเลิก
            </Button>
            <Button onClick={handleConfirmJoin} id="agree" color="primary" autoFocus>
              ตกลง
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </div>
  );
}

export default PostGames;
