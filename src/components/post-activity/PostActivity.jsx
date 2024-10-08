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
import CommentIcon from "@mui/icons-material/Comment";
import LoginIcon from "@mui/icons-material/Login";
import * as React from "react";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import DirectionsIcon from "@mui/icons-material/Directions";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { format, parseISO, isBefore, isValid } from "date-fns";
import { th } from "date-fns/locale";
import { Avatar } from "@mui/material";
import { JwtPayload } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const formatDateTime = (dateString) => {
  const date = parseISO(dateString);
  if (!isValid(date)) return "วันที่ไม่ถูกต้อง";
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
  if (!isValid(date)) return "วันที่ไม่ถูกต้อง";
  const formattedDate = format(date, "วันEEEE ที่ d MMMM yyyy", { locale: th });
  return formattedDate;
};

const formatThaiTime = (timeString) => {
  if (!timeString) return "Invalid time";
  const [hours, minutes] = timeString.split(":");
  const formattedTime = `เวลา ${hours}.${minutes} น.`;
  return formattedTime;
};

const isPastDateTime = (date, time) => {
  if (!date || !time) return false;
  const [hours, minutes] = time.split(":");
  const eventDate = new Date(date);
  eventDate.setHours(parseInt(hours, 10), parseInt(minutes, 10));
  return isBefore(eventDate, new Date());
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

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      setLoading(true);
      const accessToken = localStorage.getItem("access_token");

      try {
        if (accessToken) {
          const decoded = jwtDecode(accessToken);
          setUserId(decoded.users_id);

          const postsResponse = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity/store/${decoded.store_id}`,
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
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/store/${decoded.store_id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (!storesResponse.ok) throw new Error("Failed to fetch store");
          const storeData = await storesResponse.json(); // คาดว่าข้อมูลนี้เป็น Object

          const postsWithStores = postsData
            .filter((post) => post.status_post !== "unActive")
            .map((post) => {
              const postStore = storeData; // ใช้ storeData แทน storesData.find

              const rawCreationDate = parseISO(post.creation_date);
              if (!isValid(rawCreationDate)) {
                console.error("Invalid date format:", post.creation_date);
              }

              const isPast = isPastDateTime(
                post.date_activity,
                post.time_activity
              );

              return {
                ...post,
                userFirstName: postStore ? postStore.name_store : "Unknown",
                userProfileImage: postStore
                  ? postStore.store_image.replace("http}", "http") // แก้ไข URL ของรูปภาพให้ถูกต้อง
                  : "/images/default-profile.png",
                rawCreationDate: rawCreationDate,
                creation_date: formatDateTime(post.creation_date),
                date_activity: formatThaiDate(post.date_activity),
                time_activity: formatThaiTime(post.time_activity),
                isPast: isPast,
              };
            });

          const sortedPosts = postsWithStores.sort((a, b) => {
            if (a.isPast && !b.isPast) return 1;
            if (!a.isPast && b.isPast) return -1;
            return b.rawCreationDate - a.rawCreationDate;
          });

          setItems(sortedPosts);
        } else {
          const postsResponse = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity`
          );
          if (!postsResponse.ok) throw new Error("Failed to fetch posts");
          const postsData = await postsResponse.json();

          const storesResponse = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/store`
          );
          if (!storesResponse.ok) throw new Error("Failed to fetch stores");
          const storesData = await storesResponse.json();

          const postsWithStores = postsData
            .filter((post) => post.status_post !== "unActive")
            .map((post) => {
              const postStore = storesData.find(
                (store) => store.store_id === post.store_id
              );

              const rawCreationDate = parseISO(post.creation_date);
              if (!isValid(rawCreationDate)) {
                console.error("Invalid date format:", post.creation_date);
              }

              const isPast = isPastDateTime(
                post.date_activity,
                post.time_activity
              );

              return {
                ...post,
                userFirstName: postStore ? postStore.name_store : "Unknown",
                userProfileImage: postStore
                  ? postStore.store_image.replace("http}", "http:") // แก้ไข URL ของรูปภาพให้ถูกต้อง
                  : "/images/default-profile.png",
                rawCreationDate: rawCreationDate,
                creation_date: formatDateTime(post.creation_date),
                date_activity: formatThaiDate(post.date_activity),
                time_activity: formatThaiTime(post.time_activity),
                isPast: isPast,
              };
            });

          const sortedPosts = postsWithStores.sort((a, b) => {
            if (a.isPast && !b.isPast) return 1;
            if (!a.isPast && b.isPast) return -1;
            return b.rawCreationDate - a.rawCreationDate;
          });

          setItems(sortedPosts);
        }
      } catch (error) {
        console.error("Failed to load data: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndPosts();
  }, []);

  const handleLinkClick = async (event, postId, postOwnerId) => {
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
      const storeId = decoded.store_id; // ใช้ store_id แทน store_id
      const userRole = decoded.role;

      // ตรวจสอบว่า role ของผู้ใช้เป็น store หรือไม่
      if (userRole !== "store") {
        setSnackbarMessage("คุณไม่มีสิทธิ์ในการแก้ไขโพสต์นี้");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      // ตรวจสอบว่า storeId ตรงกับเจ้าของโพสต์หรือไม่
      if (storeId !== postOwnerId) {
        setSnackbarMessage("คุณไม่ใช่เจ้าของโพสต์นี้");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      // ตั้งค่า selectedPostId ก่อนที่จะนำทาง
      setSelectedPostId(postId); // บันทึก postId ของโพสต์ที่ถูกคลิก

      // นำทางไปที่หน้าแก้ไขโพสต์โดยใช้ `postId` ที่ถูกต้อง
      router.push(`/PostActivityEdit?id=${postId}`);
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
      const storeId = decoded.store_id;
      const userRole = decoded.role;

      console.log("Selected post: ", selectedPost); // ตรวจสอบค่าของ selectedPost ก่อนดำเนินการ
      if (!selectedPost) {
        setSnackbarMessage("ไม่พบข้อมูลของโพสต์นี้");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      if (storeId !== selectedPost.store_id) {
        setSnackbarMessage("คุณไม่ใช่เจ้าของโพสต์นี้");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }

      // เรียก API PUT เพื่ออัปเดตสถานะโพสต์
      const response = await fetch(
        `https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity/${selectedPostId}`,
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
          item.post_activity_id === selectedPostId
            ? { ...item, status_post: "unActive" }
            : item
        )
      );
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setDeleteOpen(false); // ปิด Dialog

      // รีเฟรชหน้าเว็บ
      window.location.reload();
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
  // ไม่แสดงผลข้อผิดพลาดให้ผู้ใช้เห็น
  // if (error) return <Typography sx={{ color: "white" }}>{error}</Typography>;

  return (
    <div>
      {items.length > 0 ? (
        items.map((item) => (
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
                  <img
                    src={
                      item.userProfileImage ||
                      "https://raw.githubusercontent.com/WorapakornJarusiriphot/Worapakorn644259018--Dicedreams-Next.js_TypeScript/refs/heads/main/src/Page/default.png"
                    }
                    alt={`${item.userFirstName}`}
                    width={50}
                    height={50}
                    layout="fixed"
                    objectFit="cover" // เพื่อให้รูปภาพถูกครอบอย่างสม่ำเสมอภายใน Avatar
                  />
                </Avatar>
              </Grid>
              <Grid item xs>
                <Typography variant="subtitle1" gutterBottom>
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
                    onClick={(event) =>
                      handleMenuClick(event, item.post_activity_id, item)
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
                        handleLinkClick(event, selectedPostId, item.store_id)
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

            <div
              style={{
                position: "relative",
                width: "100%", // ปรับความกว้างให้เต็มพื้นที่
                height: "400px", // กำหนดความสูงตายตัว (เช่น 400px)
                position: "relative", // สำหรับควบคุมการจัดวางภายใน div
                overflow: "hidden", // ซ่อนส่วนของรูปที่เกินออกมานอกกรอบ
              }}
            >
              <img
                src={
                  item.post_activity_image ||
                  "https://raw.githubusercontent.com/WorapakornJarusiriphot/Worapakorn644259018--Dicedreams-Next.js_TypeScript/refs/heads/main/src/Page/default.png"
                }
                alt={item.name_activity}
                width={526}
                height={296}
                layout="responsive"
                style={{
                  width: "100%", // ใช้ความกว้างเต็มที่
                  height: "100%", // ปรับความสูงให้เต็มกรอบ
                  objectFit: "cover", // ครอบคลุมกรอบโดยไม่เสียสัดส่วนของรูปภาพ
                  transition: "transform 0.3s ease",
                  transform: isFullSize ? "scale(1)" : "scale(1)",
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
                  โพสต์กิจกรรมนี้ได้สิ้นสุดลงแล้ว
                </div>
              )}
            </div>

            <br />

            <Typography
              variant="h6"
              sx={{
                wordWrap: "break-word", // จัดให้ตัดคำเมื่อข้อความยาวเกินกรอบ
                overflowWrap: "break-word", // บังคับให้ตัดคำเมื่อคำยาวเกินไป
                whiteSpace: "normal", // อนุญาตให้ข้อความถูกตัดและย้ายไปบรรทัดถัดไป
              }}
              component="h3"
              gutterBottom
            >
              {item.name_activity}
            </Typography>
            <Typography variant="body1" gutterBottom>
              วันที่กิจกรรมสิ้นสุด: {item.date_activity}
            </Typography>
            <Typography variant="body1" gutterBottom>
              เวลาที่กิจกรรมสิ้นสุด: {item.time_activity}
            </Typography>

            <br />

            <Typography
              variant="body1"
              sx={{
                wordWrap: "break-word", // จัดให้ตัดคำเมื่อข้อความยาวเกินกรอบ
                overflowWrap: "break-word", // บังคับให้ตัดคำเมื่อคำยาวเกินไป
                whiteSpace: "normal", // อนุญาตให้ข้อความถูกตัดและย้ายไปบรรทัดถัดไป
              }}
              gutterBottom
            >
              {item.detail_post}
            </Typography>
            <Typography variant="body1" gutterBottom>
              สถานที่: 43/5 ถนนราชดำเนิน (ถนนต้นสน)
              ประตูองค์พระปฐมเจดีย์ฝั่งตลาดโต้รุ่ง
            </Typography>
          </Box>
        ))
      ) : (
        <Typography sx={{ color: "white" }}></Typography>
      )}
    </div>
  );
}

export default PostActivity;
