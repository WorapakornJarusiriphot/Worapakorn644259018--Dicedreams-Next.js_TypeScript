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
import { useSearchParams } from "next/navigation";

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

function PostActivitySearch() {
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
  
    const searchParams = useSearchParams();
    const searchDateMeet = searchParams.get("search_date_meet");
    const searchTimeMeet = searchParams.get("search_time_meet");
    const searchNumPeople = searchParams.get("search_num_people");
  
    const buildQueryParams = () => {
      const params = new URLSearchParams();
  
      if (searchDateMeet) {
        params.append("search_date_meet", searchDateMeet);
      }
  
      if (searchTimeMeet) {
        params.append("search_time_meet", searchTimeMeet);
      }
  
      if (searchNumPeople) {
        params.append("search_num_people", searchNumPeople);
      }
  
      return params.toString();
    };
  
    useEffect(() => {
      const fetchUserAndPosts = async () => {
        setLoading(true);
        const accessToken = localStorage.getItem("access_token");
  
        try {
          const queryParams = buildQueryParams(); // สร้าง queryParams จากค่าที่ผู้ใช้ป้อน
          if (accessToken) {
            const decoded = jwtDecode(accessToken);
            setUserId(decoded.users_id);
  
            const postsResponse = await fetch(
              `https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity/search?${queryParams}`,
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
              };
            });

          const sortedPosts = postsWithStores.sort(
            (a, b) => b.rawCreationDate - a.rawCreationDate
          );

          setItems(sortedPosts);
        } else {
          const postsResponse = await fetch(
            `https://dicedreams-backend-deploy-to-render.onrender.com/api/postActivity` // ดึงโพสต์ทั้งหมดโดยไม่ต้องใช้ accessToken
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

  const handleLinkClick = (event, id) => {
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
            {/* <Grid item>
              <IconButton
                sx={{
                  color: "white",
                }}
                aria-label="settings"
              >
                <MoreVertOutlinedIcon />
              </IconButton>
            </Grid> */}
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
      <Snackbar
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
      </Snackbar>
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

export default PostActivitySearch;
